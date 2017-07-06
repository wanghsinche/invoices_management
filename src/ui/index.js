require('./css/ui.css');
import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import store from './jsx/redux/store';
import List from './jsx/view/list';
import About from './jsx/view/about';
import Home from './jsx/view/home';
import { Window, Toolbar, Content,Actionbar, Button,PaneGroup,Pane  } from "./jsx/photon/photon";
import AddBtn from './jsx/view/addbtn';
import Sidebar from './jsx/view/sidebar';
import Post from './jsx/view/post';
import {Loading, ErrorModal} from './jsx/view/modal';
import Header from './jsx/view/header';
import {
    HashRouter as Router,
    Route,
    Link, hashHistory
} from 'react-router-dom';

render((
    <Provider store={store}>
        <Router >
            <Window>
                <Header />
                <Content>
                    <PaneGroup>
                        <Route path='/:place' component={Sidebar}/>
                        <Route path="/Home" exact component={Home} />
                        <Route path="/About" component={About} />
                        <Route path="/Post" component={Post} />
                        <Route path="/List" component={List} />
                    </PaneGroup>
                </Content>
                <Toolbar ptType="footer">

                </Toolbar>
                <ErrorModal />
                <Loading />
            </Window>
        </Router>
    </Provider>
),
    document.getElementById('app'));