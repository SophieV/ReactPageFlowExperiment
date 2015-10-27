let
  React = require('react'),
  $ = require('jquery'),
  _ = require('underscore'),
  tilesStore = require('./tilesStore'),
  contentActions = require('./contentActions'),
  tilesActions = require('./tilesActions'),
  Tile = require('./Tile.jsx');

  import history from './history'

function getTileHolderState(props) {
  return {
	tileRange: _.range(tilesStore.getMinTileIndex(), tilesStore.getMaxTileIndex() + 1),
	routeToTileMapping: tilesStore.getRouteToTilesMapping(),
	currentRoute: props.location.pathname
  };
}

let TileHolder = React.createClass({
	getInitialState: function(){
		return getTileHolderState(this.props);
	},
	componentDidMount: function(){
		tilesStore.addChangeListener(this._onTilesInfoChanged);

		this._onRouteMayHaveChanged(true);
	},
	componentWillUnmount: function(){
		tilesStore.removeChangeListener(this._onTilesInfoChanged);
	},
	componentDidUpdate: function() {
		this._onRouteMayHaveChanged(false);
	},
	_onRouteMayHaveChanged: function(init){
		if (init) {
			tilesActions.addFirstTile(this.state.currentRoute);
		}
	},
	_onTilesInfoChanged: function(){
    	this.setState(getTileHolderState(this.props));
	},
	render: function() {
		const UPPER_THRESHOLD = 50; //px

		let tileComponents = _.map(this.state.tileRange, currentTileIndex => (
			<Tile tileIndex={currentTileIndex} 
				  route={_.findWhere(this.state.routeToTileMapping, {tileIndex: currentTileIndex}).route}  
				  tileExpanded= {currentTileIndex === 0} />));

		return (
			<div>
				{tileComponents}
			</div>
		);
	}
});

module.exports = TileHolder;