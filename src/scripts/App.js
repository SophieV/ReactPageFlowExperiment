let
  App = {};
  App.config = require('./config.js');

  App.views = {};

import React from 'react'
import { Router, Route, Link } from 'react-router'
import history from './history'

App.views.MainContainer = require('./MainContainer.jsx');
App.views.Tiles = require('./Tiles.jsx');

let routes = (
  <Router history={history}>
    <Route path="/" component={App.views.MainContainer}>
      <Route path="*" component={App.views.Tiles}/>
    </Route>
  </Router>
);

React.render(routes, document.querySelector('#app'));

