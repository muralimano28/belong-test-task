import { createStore } from 'redux';

let defaultState = {
    isApiLoading: false,
    error: null,
    repos: []
};

const repos = (state = defaultState, action) => {

    switch (action.type) {
        case 'GET_REPO_INFO_S': // GET_REPO_INFO_SUCCESS
            return {
                ...state,
                repos: action.data,
                error: null,
                isApiLoading: false
            };
        case 'GET_REPO_INFO_E': // GET_REPO_INFO_SUCCESS
            return {
                ...state,
                error: action.error,
                isApiLoading: false
            };
        case 'CLEAR_REPOS':
            return {
                ...state,
                repos: [],
                error: null
            };
        case 'IS_API_LOADING':
            return {
                ...state,
                isApiLoading: true
            };
        default:
            return state;
    }
};

const store = createStore(
    repos
);

export default store;
