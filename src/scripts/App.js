import React from 'react'
import { Router, Route, Link } from 'react-router'
import history from './history'

let MainContainer = require('./LayoutSkeleton/MainContainer.jsx');
let RouteTilesManager = require('./RoutesCarousel/RouteTilesManager.jsx');

let routes = (
  <Router history={history}>
    <Route path="/" component={MainContainer}>
      <Route path="*" component={RouteTilesManager}/>
    </Route>
  </Router>
);

React.render(routes, document.querySelector('#app'));

