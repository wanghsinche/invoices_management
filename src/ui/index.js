require('./css/ui.css');
import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import store from './jsx/redux/store';
import List from './jsx/view/list';
import Adm from './jsx/view/adm';
import Home from './jsx/view/home';
import { Window, Toolbar, Content,Actionbar, Button,PaneGroup,Pane  } from "./jsx/photon/photon";
import AddBtn from './jsx/view/addbtn';
import Sidebar from './jsx/view/sidebar';
import Post from './jsx/view/post';
import {Loading, ErrorModal} from './jsx/view/modal';
import Header from './jsx/view/header';
import {
    HashRouter as Router,
    Route, Redirect,
    Link, hashHistory
} from 'react-router-dom';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
global.hostname = localStorage.getItem('hostname');
if(!global.hostname){
    global.hostname = 'http://123.206.194.97';
    localStorage.setItem('hostname', global.hostname);
}
//尝试更新
if (new Date().getDay() === 2) {
    ipcRenderer.send('asynchronous-update', global.hostname, true);
}
ipcRenderer.on('update-hostname',function(){
    global.hostname = localStorage.getItem('hostname');  
    console.log(global.hostname);  
});

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => {
    return (
    store.getState().rdsInfo.loged ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/Home',
        state: { from: props.location }
      }}/>
    )
  )
  }}/>
)




render((
    <Provider store={store}>
        <Router >
            <Window>
                <Header />
                <Content>
                    <PaneGroup>
                        <Route path='/:place' component={Sidebar}/>
                        <Route path="/Home" component={Home} />
                        <PrivateRoute path="/Adm" component={Adm} />
                        <PrivateRoute path="/Post" component={Post} />
                        <PrivateRoute path="/List" component={List} />
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

