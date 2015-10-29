let React = require('react'),
    _ = require('underscore'),
    objectAssign = require('react/lib/Object.assign'),
    EventEmitter = require('events').EventEmitter,
    AppDispatcher = require('./AppDispatcher'),
    actionsConstants = require('./actionsConstants'),
    eventsConstants = require('./eventsConstants');

let _store = {
  MAX_ROUTE_FAKE: 10,
  MIN_ROUTE_FAKE: -6,
  nextFakeAvailableRouteToLoad: 0,
  mapTileToRoute: [],
  maxTileIndex: -2, // this value is to make sure that no tile does not give range [0]
  minTileIndex: 0,
  lastRouteRequestedBelow: null,
  lastRouteRequestedAbove: null,
  lastRouteRequested: null,
  routeAccessedDirectlyFromContent: null,
  nextRouteUp: null,
  nextRouteDown: null,
  routeIgnored: null
};

let findNextAvailableRoute = function(previousRoute, directionBelow) {
    let route;

    // match from expected display order
    if (previousRoute != null) {
        if (directionBelow) {
            if (previousRoute == "/home") {
              route = "/work";
            } 
        } else {
            if (previousRoute == "/work") {
              route = "/home";
            } 
        }
    }

    // random
    if (route == null) {
      let routeNotRenderedYet = false;

      while(!routeNotRenderedYet && _store.nextFakeAvailableRouteToLoad <= _store.MAX_ROUTE_FAKE && _store.nextFakeAvailableRouteToLoad >= _store.MIN_ROUTE_FAKE) {

        if (directionBelow) {
            _store.nextFakeAvailableRouteToLoad++;
        } else {
           _store.nextFakeAvailableRouteToLoad--; 
        }
        
        if (_.findWhere(_store.mapTileToRoute, {route: _store.nextFakeAvailableRouteToLoad}) == null) {
          routeNotRenderedYet = true;
          route = "/" + _store.nextFakeAvailableRouteToLoad;
        }

      }
    }

    return route;
}

let addTile = function(requestedRoute, directionBelow) {
    let shouldUpdate = true;

    if (requestedRoute != null) {

      if (directionBelow) {

          if (_store.maxTileIndex === -2) {
            _store.maxTileIndex = 0;
          } else {
            _store.maxTileIndex++;
          }
          
          _store.mapTileToRoute.push({tileIndex: _store.maxTileIndex, route: requestedRoute});
          _store.lastRouteRequestedBelow = requestedRoute;
          console.log('adding tile [' + _store.maxTileIndex + ':' + requestedRoute + ']');

      } else {

          _store.minTileIndex--;
          _store.mapTileToRoute.push({tileIndex: _store.minTileIndex, route: requestedRoute});
          _store.lastRouteRequestedAbove = requestedRoute;
          console.log('adding tile [' + _store.minTileIndex + ':' + requestedRoute + ']');

      }

      _store.lastRouteRequested = requestedRoute;

      _store.nextRouteDown = findNextAvailableRoute(_store.lastRouteRequestedBelow, true);
      _store.nextRouteUp = findNextAvailableRoute(_store.lastRouteRequestedAbove, true);

    } else {
      shouldUpdate = false;
    }

    return shouldUpdate;
};

let resetStore = function () {
    _store.mapTileToRoute = [];
    _store.maxTileIndex = -2;
    _store.minTileIndex = 0;
    _store.nextFakeAvailableRouteToLoad = 0;
    _store.lastRouteRequestedBelow = null;
    _store.lastRouteRequestedAbove = null;
    _store.lastRouteRequested = null;
    _store.routeAccessedDirectlyFromContent = null;
    _store.nextRouteDown = null;
    _store.nextRouteUp = null;
    _store.routeIgnored = null;
}

let ignoreRoute = function(routeToIgnore) {
  _store.routeIgnored = routeToIgnore;
}

let tilesStore = objectAssign({}, EventEmitter.prototype, {
  addChangeListener: function(cb){
    this.on(eventsConstants.CHANGE_EVENT, cb);
  },
  removeChangeListener: function(cb){
    this.removeListener(eventsConstants.CHANGE_EVENT, cb);
  },
  maxTileIndex: function(){
    return _store.maxTileIndex;
  },
  minTileIndex: function(){
    return _store.minTileIndex;
  },
  mapTileToRoute: function(){
    return _store.mapTileToRoute;
  },
  lastRouteRequested: function() {
    return _store.lastRouteRequested;
  },
  routeAccessedDirectlyFromContent: function() {
    return _store.routeAccessedDirectlyFromContent;
  },
  routeIgnored: function() {
    return _store.routeIgnored;
  },
  scrollingDetectionTopEnabled: function() {
    return false;// (_store.nextRouteUp != null);
  },
  scrollingDetectionBottomEnabled: function() {
    return (_store.nextRouteDown != null);
  },
  scrollingDetectionEnabled: function() {
    return (_store.nextRouteDown != null || _store.nextRouteUp != null);
  },
  nextRouteDown: function() {
    return _store.nextRouteDown;
  },
  nextRouteUp: function() {
    return _store.nextRouteUp;
  }
});

AppDispatcher.register(function(payload)
{
  let action = payload.action;
  switch(action.actionType)
  {
    case actionsConstants.ADD_TILE_DOWN:
      ignoreRoute(action.data);
      if (addTile(action.data, true)) {
        tilesStore.emit(eventsConstants.CHANGE_EVENT);
      }
    break;
    case actionsConstants.ADD_TILE_UP:
      ignoreRoute(action.data);
      if (addTile(action.data, false)) {
          tilesStore.emit(eventsConstants.CHANGE_EVENT);
      }
    break;
    case actionsConstants.ADD_FIRST_TILE:
      resetStore();
      if (addTile(action.data, true)) {
        tilesStore.emit(eventsConstants.CHANGE_EVENT);
      }
    break;
    default:
      return true;
  }
});

module.exports = tilesStore;