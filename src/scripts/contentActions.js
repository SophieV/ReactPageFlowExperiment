let AppDispatcher = require('./AppDispatcher'),
	actionsConstants = require('./actionsConstants');

var tilesActions = {
  loadRouteData: function(route){
   Dispatcher.handleAction({
      actionType: actionsConstants.LOAD_TILE_DATA,
      data: route
    }); 
  }
};

module.exports = tilesActions;