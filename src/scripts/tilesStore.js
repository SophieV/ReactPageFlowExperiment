let React = require('react'),
    _ = require('underscore'),
    objectAssign = require('react/lib/Object.assign'),
    EventEmitter = require('events').EventEmitter,
    AppDispatcher = require('./AppDispatcher'),
    actionsConstants = require('./actionsConstants'),
    eventsConstants = require('./eventsConstants');

let _store = {
  mappingRouteToTile: [],
  maxTileIndex: -2,
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
  routeAccessedDirectly: null,
  routeIgnored: null
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
            if (_store.maxTileIndex === -2) {
              _store.maxTileIndex = 0;
            } else {
              _store.maxTileIndex++;
            }
            
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
    _store.maxTileIndex = -2;
    _store.minTileIndex = 0;
    _store.nextAvailableRouteToLoad = 0;
    _store.lastRouteRequestedBelow = null;
    _store.lastRouteRequestedAbove = null;
    _store.lastRouteRequested = null;
    _store.routeAccessedDirectly = null;
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
  routeToTileMapping: function(){
    return _store.mappingRouteToTile;
  },
  lastRouteRequested: function() {
    return _store.lastRouteRequested;
  },
  routeAccessedDirectly: function() {
    return _store.routeAccessedDirectly;
  },
  routeIgnored: function() {
    return _store.routeIgnored;
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