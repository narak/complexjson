
import './base.scss';

import React from 'react';
import { render } from 'react-dom';
import App from 'components/App';

render(
    <App />,
    document.getElementById('cj-container')
);

if (module.hot) {
    module.hot.accept('components/App', () => {
        const App = require('components/App').default;
        render(
            <App />,
            document.getElementById('cj-container')
        );
    });
}
