let AppDispatcher = require('./AppDispatcher'),
	actionsConstants = require('./actionsConstants');

var tilesActions = {
	addTileDown: function(route){
    AppDispatcher.handleAction({
      actionType: actionsConstants.ADD_TILE_DOWN,
      data: route
    })
  },
  addTileUp: function(route){
    AppDispatcher.handleAction({
      actionType: actionsConstants.ADD_TILE_UP,
      data: route
    })
  },
  addFirstTile: function(route){
    AppDispatcher.handleAction({
      actionType: actionsConstants.ADD_FIRST_TILE,
      data: route
    });
    // loading of first tile content is triggered here because otherwise the dispatcher throws an exception. an action cannot be triggered during the unfolding of a previous action.
    // the loading of other tiles content cannot be chained this way because the route will not be known. it will be triggered as the state has been updated.
    AppDispatcher.handleAction({
      actionType: actionsConstants.LOAD_TILE_DATA,
      data: route
    });
  }
};

module.exports = tilesActions;