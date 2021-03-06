import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {ListGroupItem} from './';
import {Group, Header} from '../UI/List';

export const ListGroup = ({
    name,
    items,
    lockedItems,
    dateFormat,
    timeFormat,
    agendas,
    session,
    privileges,
    calendars,
    activeFilter,
    showRelatedPlannings,
    relatedPlanningsInList,
    onItemClick,
    onDoubleClick,
    onAddCoverageClick,
    onMultiSelectClick,
    selectedEventIds,
    selectedPlanningIds,
    itemActions,
    users,
    desks,
    showAddCoverage,
    hideItemActions,
    listFields,
}) => (
    <div className="ListGroup">
        <Header title={moment(name).format('dddd LL')} />
        <Group spaceBetween={true}>
            {items.map((item) => (
                <ListGroupItem
                    key={item._id}
                    date={name}
                    item={item}
                    onItemClick={onItemClick}
                    onDoubleClick={onDoubleClick}
                    onAddCoverageClick={onAddCoverageClick.bind(null, item)}
                    lockedItems={lockedItems}
                    dateFormat={dateFormat}
                    timeFormat={timeFormat}
                    agendas={agendas}
                    session={session}
                    privileges={privileges}
                    activeFilter={activeFilter}
                    showRelatedPlannings={showRelatedPlannings}
                    relatedPlanningsInList={relatedPlanningsInList}
                    onMultiSelectClick={onMultiSelectClick}
                    selectedEventIds={selectedEventIds}
                    selectedPlanningIds={selectedPlanningIds}
                    itemActions={itemActions}
                    users={users}
                    desks={desks}
                    showAddCoverage={showAddCoverage}
                    hideItemActions={hideItemActions}
                    calendars={calendars}
                    listFields={listFields}
                />
            ))}
        </Group>
    </div>
);

ListGroup.propTypes = {
    name: PropTypes.string,
    items: PropTypes.array,
    users: PropTypes.array,
    desks: PropTypes.array,
    onItemClick: PropTypes.func.isRequired,
    onDoubleClick: PropTypes.func,
    editItem: PropTypes.object,
    previewItem: PropTypes.object,
    lockedItems: PropTypes.object.isRequired,
    dateFormat: PropTypes.string.isRequired,
    timeFormat: PropTypes.string.isRequired,
    agendas: PropTypes.array.isRequired,
    session: PropTypes.object,
    privileges: PropTypes.object,
    calendars: PropTypes.array,
    activeFilter: PropTypes.string,
    showRelatedPlannings: PropTypes.func,
    relatedPlanningsInList: PropTypes.object,
    onAddCoverageClick: PropTypes.func,
    onMultiSelectClick: PropTypes.func,
    selectedEventIds: PropTypes.array,
    selectedPlanningIds: PropTypes.array,
    itemActions: PropTypes.object,
    showAddCoverage: PropTypes.bool,
    hideItemActions: PropTypes.bool,
    listFields: PropTypes.object,
};