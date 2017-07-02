import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import store from './jsx/redux/store';
import App from './jsx/view/app';
import About from './jsx/view/About';
import { Router, Route, hashHistory } from 'react-router';

render((
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={App} />
            <Route path="/About" component={About} />
        </Router>
    </Provider>
),
    document.getElementById('app'));