# This file is part of Superdesk.
#
# Copyright 2013, 2014 Sourcefabric z.u. and contributors.
#
# For the full copyright and license information, please see the
# AUTHORS and LICENSE files distributed with this source code, or
# at https://www.sourcefabric.org/superdesk/license

"""Superdesk Files"""

import superdesk
from superdesk import get_resource_service
from superdesk.errors import SuperdeskApiError
import logging

logger = logging.getLogger(__name__)


class EventsFilesResource(superdesk.Resource):
    schema = {
        'media': {'type': 'media'},
        'mimetype': {'type': 'string'},
        'filemeta': {'type': 'dict'}
    }
    datasource = {
        'source': 'events_files',
        'projection': {
            'mimetype': 1,
            'filemeta': 1,
            '_created': 1,
            '_updated': 1,
            '_etag': 1,
            'media': 1,
        }
    }
    url = 'events_files'
    item_methods = ['GET', 'DELETE']
    public_methods = ['GET']
    resource_methods = ['GET', 'POST']
    privileges = {'POST': 'planning_event_management', 'DELETE': 'planning_event_management'}


class EventsFilesService(superdesk.Service):

    def on_create(self, docs):
        for doc in docs:
            # save the media id to retrieve the file later
            doc['filemeta'] = {'media_id': doc['media']}

    def on_delete(self, doc):
        events_using_file = get_resource_service("events").find(where={'files': doc.get("_id")})
        if events_using_file.count() > 0:
            raise SuperdeskApiError.forbiddenError('Delete failed. File still used by other events.')
