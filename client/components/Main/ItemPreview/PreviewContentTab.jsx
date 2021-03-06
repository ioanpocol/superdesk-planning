import React from 'react';
import PropTypes from 'prop-types';
import {getItemType} from '../../../utils';
import {ITEM_TYPE} from '../../../constants';
import {EventPreviewContent} from '../../Events/EventPreviewContent';
import {PlanningPreviewContent} from '../../Planning/PlanningPreviewContent';

export const PreviewContentTab = ({item, hideRelatedItems}) => {
    const itemType = getItemType(item);

    switch (itemType) {
    case ITEM_TYPE.EVENT:
        return (<EventPreviewContent hideRelatedItems={hideRelatedItems} />);
    case ITEM_TYPE.PLANNING:
        return (<PlanningPreviewContent hideRelatedItems={hideRelatedItems} />);
    default:
        return null;
    }
};

PreviewContentTab.propTypes = {
    item: PropTypes.object.isRequired,
    hideRelatedItems: PropTypes.bool,
};

PreviewContentTab.defaultProps = {hideRelatedItems: false};
