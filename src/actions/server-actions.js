import request from 'utils/request';

import Store from 'stores';

export default {
    'getRepos': (username) => {
        Store.dispatch({
            type: 'IS_API_LOADING',
            value: true
        });
        request.getRepos(username);
    }
}
