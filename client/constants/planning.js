export const PLANNING = {
    ACTIONS: {
        SPIKE_PLANNING: 'SPIKE_PLANNING',
        UNSPIKE_PLANNING: 'UNSPIKE_PLANNING',
        REQUEST_PLANNINGS: 'REQUEST_PLANNINGS',
        RECEIVE_PLANNINGS: 'RECEIVE_PLANNINGS',
        OPEN_PLANNING_EDITOR: 'OPEN_PLANNING_EDITOR',
        PREVIEW_PLANNING: 'PREVIEW_PLANNING',
        CLOSE_PLANNING_EDITOR: 'CLOSE_PLANNING_EDITOR',
        SET_ONLY_FUTURE: 'SET_ONLY_FUTURE',
        SET_ONLY_SPIKED: 'SET_ONLY_SPIKED',
        PLANNING_FILTER_BY_KEYWORD: 'PLANNING_FILTER_BY_KEYWORD',
        PLANNING_FILTER_BY_TIMELINE: 'PLANNING_FILTER_BY_TIMELINE',
        RECEIVE_COVERAGE: 'RECEIVE_COVERAGE',
        COVERAGE_DELETED: 'COVERAGE_DELETED',
        RECEIVE_PLANNING_HISTORY: 'RECEIVE_PLANNING_HISTORY',
        SET_LIST: 'SET_PLANNING_LIST',
        ADD_TO_LIST: 'ADD_TO_PLANNING_LIST',
        CLEAR_LIST: 'CLEAR_PLANNING_LIST',
        OPEN_ADVANCED_SEARCH: 'PLANNING_OPEN_ADVANCED_SEARCH',
        CLOSE_ADVANCED_SEARCH: 'PLANNING_CLOSE_ADVANCED_SEARCH',
        SET_ADVANCED_SEARCH: 'SET_ADVANCED_SEARCH',
        CLEAR_ADVANCED_SEARCH: 'CLEAR_ADVANCED_SEARCH',
        MARK_PLANNING_CANCELLED: 'MARK_PLANNING_CANCELLED',
        MARK_PLANNING_POSTPONED: 'MARK_PLANNING_POSTPONED',
    },
    // Number of ids to look for by single request
    // because url length must stay short
    // chunk size must be lower than page limit (25)
    FETCH_IDS_CHUNK_SIZE: 25,
    PLANNING_FILTER_TIMELINE: {
        FUTURE: 'FUTURE',
        PAST: 'PAST',
        NOT_SCHEDULED: 'NOT_SCHEDULED',
    },
}
