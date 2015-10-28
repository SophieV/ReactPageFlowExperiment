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
	tileRange: _.range(tilesStore.minTileIndex(), tilesStore.maxTileIndex() + 1),
	routeToTileMapping: tilesStore.routeToTileMapping(),
	lastRouteRequested: tilesStore.lastRouteRequested(),
	routeAccessedDirectly: tilesStore.routeAccessedDirectly(),
	routeIgnored: tilesStore.routeIgnored()
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
		let browserUrl = this.props.location.pathname;
		if (browserUrl !== this.state.lastRouteRequested) {
			if (init || browserUrl !== this.state.routeIgnored) {
				tilesActions.addFirstTile(browserUrl);
			} else {
				tilesActions.addTileDown(browserUrl);
			}
		}
	},
	_onTilesInfoChanged: function(){
    	this.setState(getTileHolderState(this.props));
	},
	render: function() {
		const UPPER_THRESHOLD = 50; //px

		let tileRoute,
			tileTopTile,
			tileBottomTile,
			tileAccessedDirectly;

		let tilesComponent = this;

		let tiles = _.map(tilesComponent.state.tileRange, function(index) {
			tileRoute = _.findWhere(tilesComponent.state.routeToTileMapping, {tileIndex: index}).route;
			tileTopTile = (index === tilesComponent.state.tileRange[0]);
			tileBottomTile = (index === tilesComponent.state.tileRange[1]);
			tileAccessedDirectly = (tileRoute === tilesComponent.state.routeAccessedDirectly);

			return (<Tile tileIndex={index} 
						  route={tileRoute}  
						  tileExpanded= {tileTopTile || tileAccessedDirectly}
						  firstTile={tileTopTile}
						  lastTile={tileBottomTile}
						  accessedDirectly={tileAccessedDirectly} />);
		});

		return (
			<div>
				{tiles}
			</div>
		);
	}
});

module.exports = TileHolder;