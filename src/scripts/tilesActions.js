let AppDispatcher = require('./AppDispatcher'),
	actionsConstants = require('./actionsConstants');

var tilesActions = {
	addTileDown: function(route){
    AppDispatcher.handleAction({
      actionType: actionsConstants.ADD_TILE_DOWN,
      data: route
    });
    AppDispatcher.handleAction({
      actionType: actionsConstants.LOAD_TILE_DATA,
      data: route
    });
  },
  addTileUp: function(route){
    AppDispatcher.handleAction({
      actionType: actionsConstants.ADD_TILE_UP,
      data: route
    });
    AppDispatcher.handleAction({
      actionType: actionsConstants.LOAD_TILE_DATA,
      data: route
    });
  },
  addFirstTile: function(route){
    AppDispatcher.handleAction({
      actionType: actionsConstants.ADD_FIRST_TILE,
      data: route
    });
    // loading of first tile content is triggered here because otherwise the dispatcher throws an exception. an action cannot be triggered during the unfolding of a previous action.
    AppDispatcher.handleAction({
      actionType: actionsConstants.LOAD_FIRST_TILE_DATA,
      data: route
    });
  }
};

module.exports = tilesActions;