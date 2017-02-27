import React from 'react';
import { render } from 'react-dom';

import App from 'containers';

/*
 * Importing default styles which is required for whole app.
 */

import './normalize.min.css';
import './default.css';

render(
    <App />,
    document.getElementById('root')
);

if (module.hot) {
    module.hot.accept('containers', () => {
        const NewRoot = require('containers').default;

        render(
            <NewRoot />,
            document.getElementById('root')
        );
    })
}
