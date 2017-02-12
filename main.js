import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory, IndexRedirect } from 'react-router';
import Auth from './services/auth.js';
import App from './App.jsx';
import Home from './module/home/home.jsx';
import InputPanel from './module/inputpanel/router.jsx';
import About from './module/about/router.jsx';
import Manage from './module/manage/router.jsx';

function requireAuth(nextState, replace) {
  if (!Auth.islogin()) {
    replace({
      pathname: '/home',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

let routes = {
	path:'/',
	component:App,
	indexRoute : { component: Home },
	childRoutes:[
		{
			path: 'home', component: Home
		},
		InputPanel,
		Manage,
		About
	]
};


render((
	<Router history={hashHistory} routes={routes}>
		
	</Router>
), document.getElementById('app'));
