let React = require('react'),
    _ = require('underscore'),
    objectAssign = require('react/lib/Object.assign'),
    EventEmitter = require('events').EventEmitter,
    AppDispatcher = require('./AppDispatcher'),
    actionsConstants = require('./actionsConstants'),
    eventsConstants = require('./eventsConstants');

let _store = {
  mappingRouteToTile: [],
  maxTileIndex: -1,
  minTileIndex: 0,
  nextAvailableRouteToLoad: 0,
  lastRouteRequestedBelow: null,
  lastRouteRequestedAbove: null,
  lastRouteRequested: null,
  _inSensitiveZonePageUp: true, // starting at the top of the viewport
  _inSensitiveZonePageBottom: false,
  _inSensitiveZoneHappening: false,
  _routeDirectLink: null,
  _scrollDetectionEnabled: true,
  currentRoute: null
};

let findNextAvailableRoute = function(previousRoute, below) {
    let route;

    // match from expected display order
    if (previousRoute != null) {
        if (below) {
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

      while(!routeNotRenderedYet) {
        if (below) {
            _store.nextAvailableRouteToLoad++;
        } else {
           _store.nextAvailableRouteToLoad--; 
        }
        
        if (_.findWhere(_store.mappingRouteToTile, {route: _store.nextAvailableRouteToLoad}) == null) {
          routeNotRenderedYet = true;
        }
      }
    }

    route = "/" + _store.nextAvailableRouteToLoad; 

    return route;
}

let addTile = function(route, below) {
    let shouldUpdate = true;
    let routeUsed = route;

    if (routeUsed == null){
        routeUsed = findNextAvailableRoute((below?_store.lastRouteRequestedBelow:_store.lastRouteRequestedAbove), below);  
    }

    if (routeUsed != null) {
        if (below) {
            _store.maxTileIndex++;
            _store.mappingRouteToTile.push({tileIndex: _store.maxTileIndex, route: routeUsed});
            _store.lastRouteRequestedBelow = routeUsed;
            console.log('adding tile [' + _store.maxTileIndex + ':' + routeUsed + ']');
        } else {
            _store.minTileIndex--;
            _store.mappingRouteToTile.push({tileIndex: _store.minTileIndex, route: routeUsed});
            _store.lastRouteRequestedAbove = routeUsed;
            console.log('adding tile [' + _store.minTileIndex + ':' + routeUsed + ']');
        }

        _store.lastRouteRequested = routeUsed;
    } else {
    console.log('no route to load ' + (below?"below.":"above.") + " no tile will be added.");
    shouldUpdate = false;
    }
    return shouldUpdate;
};

let resetStore = function () {
    _store.mappingRouteToTile = [];
    _store.maxTileIndex = -1;
    _store.minTileIndex = 0;
    _store.nextAvailableRouteToLoad = 0;
    _store.lastRouteRequestedBelow = null;
    _store.lastRouteRequestedAbove = null;
}

let addFirstTile = function(route) {
    resetStore();
    _store.currentRoute = route;
    return addTile(route, true);
};

let tilesStore = objectAssign({}, EventEmitter.prototype, {
  addChangeListener: function(cb){
    this.on(eventsConstants.CHANGE_EVENT, cb);
  },
  removeChangeListener: function(cb){
    this.removeListener(eventsConstants.CHANGE_EVENT, cb);
  },
  getMaxTileIndex: function(){
    return _store.maxTileIndex;
  },
  getMinTileIndex: function(){
    return _store.minTileIndex;
  },
  getRouteToTilesMapping: function(){
    return _store.mappingRouteToTile;
  },
  lastRequestedRoute: function() {
    return _store.lastRouteRequested;
  },
  currentRoute: function(){
    return _store.currentRoute;
  }
});

AppDispatcher.register(function(payload)
{
  let action = payload.action;
  switch(action.actionType)
  {
    case actionsConstants.ADD_TILE_DOWN:
      if (addTile(action.data, true)) {
        tilesStore.emit(eventsConstants.CHANGE_EVENT);
      }
    break;
    case actionsConstants.ADD_TILE_UP:
        if (addTile(action.data, false)) {
            tilesStore.emit(eventsConstants.CHANGE_EVENT);
        }
    break;
    case actionsConstants.ADD_FIRST_TILE:
      addFirstTile(action.data);
      tilesStore.emit(eventsConstants.CHANGE_EVENT);
    break;
    default:
      return true;
  }
});

module.exports = tilesStore;