let AppDispatcher = require('./AppDispatcher'),
	actionsConstants = require('./actionsConstants');

var contentActions = {
  loadFirstRouteData: function(route){
   Dispatcher.handleAction({
      actionType: actionsConstants.LOAD_FIRST_TILE_DATA,
      data: route
    }); 
  },
  loadRouteData: function(route){
   Dispatcher.handleAction({
      actionType: actionsConstants.LOAD_TILE_DATA,
      data: route
    }); 
  }
};

module.exports = contentActions;