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
  },
  loadTileData: function(route){
   AppDispatcher.handleAction({
      actionType: actionsConstants.LOAD_TILE_DATA,
      data: route
    }); 
  }
};

module.exports = tilesActions;