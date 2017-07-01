import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import store from './jsx/redux/store';
import App from './jsx/view/app';
render((
    <Provider store={store}>
        <App  />
    </Provider>
),
    document.getElementById('app'));