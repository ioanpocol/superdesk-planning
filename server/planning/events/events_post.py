
from flask import abort
from eve.utils import config

from superdesk import get_resource_service, logger
from superdesk.resource import Resource, not_analyzed
from superdesk.notification import push_notification

from .events import EventsResource
from .events_base_service import EventsBaseService
from planning.common import WORKFLOW_STATE, POST_STATE, post_state, UPDATE_SINGLE,\
    UPDATE_METHODS, UPDATE_FUTURE, get_item_post_state, enqueue_planning_item, get_version_item_for_post


class EventsPostResource(EventsResource):
    schema = {
        'event': Resource.rel('events', type='string', required=True),
        'etag': {'type': 'string', 'required': True},
        'pubstatus': {'type': 'string', 'required': True, 'allowed': post_state},

        # The update method used for recurring events
        'update_method': {
            'type': 'string',
            'allowed': UPDATE_METHODS,
            'mapping': not_analyzed,
            'nullable': True
        },
    }

    url = 'events/post'
    resource_title = endpoint_name = 'events_post'
    resource_methods = ['POST']
    privileges = {'POST': 'planning_event_post'}
    item_methods = []


class EventsPostService(EventsBaseService):
    def create(self, docs):
        ids = []
        for doc in docs:
            event = get_resource_service('events').find_one(req=None, _id=doc['event'])

            if not event:
                abort(412)

            update_method = self.get_update_method(event, doc)

            if update_method == UPDATE_SINGLE:
                ids.extend(
                    self._post_single_event(doc, event)
                )
            else:
                ids.extend(
                    self._post_recurring_events(doc, event, update_method)
                )
        return ids

    @staticmethod
    def validate_post_state(new_post_state):
        try:
            assert new_post_state in post_state
        except AssertionError:
            abort(409)

    @staticmethod
    def validate_item(doc):
        errors = get_resource_service('planning_validator').post([{
            'validate_on_post': True,
            'type': 'event',
            'validate': doc
        }])[0]

        if errors:
            # We use abort here instead of raising SuperdeskApiError.badRequestError
            # as eve handles error responses differently between POST and PATCH methods
            abort(400, description=errors)

    def _post_single_event(self, doc, event):
        self.validate_post_state(doc['pubstatus'])
        self.validate_item(event)
        updated_event = self.post_event(event, doc['pubstatus'])

        event_type = 'events:posted' if doc['pubstatus'] == POST_STATE.USABLE else 'events:unposted'
        push_notification(
            event_type,
            item=event[config.ID_FIELD],
            etag=updated_event['_etag'],
            pubstatus=updated_event['pubstatus'],
            state=updated_event['state']
        )

        return [doc['event']]

    def _post_recurring_events(self, doc, original, update_method):
        historic, past, future = self.get_recurring_timeline(original)

        # Determine if the selected event is the first one, if so then
        # act as if we're changing future events
        if len(historic) == 0 and len(past) == 0:
            update_method = UPDATE_FUTURE

        if update_method == UPDATE_FUTURE:
            posted_events = [original] + future
        else:
            posted_events = historic + past + [original] + future

        # First we want to validate that all events can be posted
        for event in posted_events:
            self.validate_post_state(doc['pubstatus'])
            self.validate_item(event)

        # Next we perform the actual post
        updated_event = None
        ids = []
        items = []
        for event in posted_events:
            updated_event = self.post_event(event, doc['pubstatus'])
            ids.append(event[config.ID_FIELD])
            items.append({
                'id': event[config.ID_FIELD],
                'etag': updated_event['_etag']
            })

        event_type = 'events:posted:recurring' if doc['pubstatus'] == POST_STATE.USABLE \
            else 'events:unposted:recurring'

        push_notification(
            event_type,
            item=original[config.ID_FIELD],
            items=items,
            recurrence_id=str(original.get('recurrence_id')),
            pubstatus=updated_event['pubstatus'],
            state=updated_event['state']
        )

        return ids

    def post_event(self, event, new_post_state):
        # update the event with new state
        new_item_state = get_item_post_state(event, new_post_state)
        updates = {'state': new_item_state, 'pubstatus': new_post_state}
        event['pubstatus'] = new_post_state
        # Remove previous workflow state reason
        if event['state'] != new_item_state and new_item_state in [WORKFLOW_STATE.SCHEDULED, WORKFLOW_STATE.KILLED]:
            updates['state_reason'] = None

        updated_event = get_resource_service('events').update(event['_id'], updates, event)
        event.update(updated_event)

        # enqueue the event
        # these fields are set for enqueue process to work. otherwise not needed
        version, event = get_version_item_for_post(event)
        # save the version into the history
        updates['version'] = version

        get_resource_service('events_history')._save_history(event, updates, 'post')

        version_id = get_resource_service('published_planning').post([{'item_id': event['_id'],
                                                                       'version': version, 'type': 'event',
                                                                       'published_item': event}])
        if version_id:
            # Asynchronously enqueue the item for publishing.
            enqueue_planning_item.apply_async(kwargs={'id': version_id[0]})
        else:
            logger.error('Failed to save planning version for event item id {}'.format(event['_id']))

        return updated_event

    @staticmethod
    def _get_post_state(event, new_post_state):
        if new_post_state == POST_STATE.CANCELLED:
            return WORKFLOW_STATE.KILLED

        if event.get('pubstatus') != POST_STATE.USABLE:
            # Publishing for first time, default to 'schedule' state
            return WORKFLOW_STATE.SCHEDULED

        return event.get('state')
