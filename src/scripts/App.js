let
  App = {};
  App.config = require('./config.js');
  App.views = {};

import React from 'react'
import { Router, Route, Link } from 'react-router'

App.views.MainContainer = require('./MainContainer.jsx');
App.views.Tiles = require('./Tiles.jsx');

let routes = (
  <Router>
    <Route path="/" component={App.views.MainContainer}>
      <Route path="home" component={App.views.Tiles}/>
      <Route path="work" component={App.views.Tiles}/>
      <Route path="*" component={App.views.Tiles}/>
    </Route>
  </Router>
);

React.render(routes, document.querySelector('#app'));

