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
	mapTileToRoute: tilesStore.mapTileToRoute(),
	lastRouteRequested: tilesStore.lastRouteRequested(),
	routeAccessedDirectlyFromContent: tilesStore.routeAccessedDirectlyFromContent(),
	routeIgnored: tilesStore.routeIgnored(),
	scrollingDetectionTopEnabled: tilesStore.scrollingDetectionTopEnabled(),
	scrollingDetectionBottomEnabled: tilesStore.scrollingDetectionBottomEnabled(),
	scrollingDetectionEnabled: tilesStore.scrollingDetectionEnabled(),
	nextRouteDown: tilesStore.nextRouteDown(),
	nextRouteUp: tilesStore.nextRouteUp()
  };
}

let TileHolder = React.createClass({
	getInitialState: function(){
		return getTileHolderState(this.props);
	},
	componentDidMount: function(){
		tilesStore.addChangeListener(this._onTilesInfoChanged);

		this._initDone = false;

		this._onRouteMayHaveChanged();
	},
	componentWillUnmount: function(){
		tilesStore.removeChangeListener(this._onTilesInfoChanged);
	},
	componentDidUpdate: function() {
		this._onRouteMayHaveChanged();
	},
	_updateRouteDisplayedToUser: function(routeValue){
		history.replaceState(null, routeValue);
	},
	_onRouteMayHaveChanged: function(init){
		let browserUrl = this.props.location.pathname;

		if (!this._initDone || (browserUrl !== this.state.lastRouteRequested && this.state.lastRouteRequested !== this.state.routeIgnored)) {

			this._initDone = true;
			tilesActions.addFirstTile(browserUrl);

		}
	},
	_onTilesInfoChanged: function(){
		let newState = getTileHolderState(this.props);
    	this.setState(newState);

    	let browserUrl = this.props.location.pathname;

    	if (this._initDone && browserUrl !== newState.lastRouteRequested && newState.lastRouteRequested === newState.routeIgnored) {
    		this._updateRouteDisplayedToUser(newState.routeIgnored);
    	}

    	this._lastRouteTriggeredPending = false;
	},
	_addingScrollingDetection: function(tilesComponent) {
		const UPPER_THRESHOLD = 50; //px

		$(function($) {
	      	let $appContainer = $('#app');

	      	window.onscroll = function() {
		      	if (tilesComponent.state.scrollingDetectionEnabled && !tilesComponent._lastRouteTriggeredPending) {

			      	let thisScrollTop = Math.round($(this).scrollTop()),
			            thisInnerHeight = Math.round($(this).innerHeight()),
			            containeR = window,
			            containeD = document,
			            scrollPercent = 1 * $(containeR).scrollTop() / ($(containeD).height() - $(containeR).height());

			        let lower_threshold = thisScrollTop + thisInnerHeight + 1;

			        if($appContainer.outerHeight() <= lower_threshold)
			        {
			        	if (tilesComponent.state.scrollingDetectionBottomEnabled)
			        	{
			        		console.log("reaching bottom of page.");

			        		tilesComponent._lastRouteTriggeredPending = true;

			        		tilesActions.addTileDown(tilesComponent.state.nextRouteDown);
			        	}
			        } 
			        else if(thisScrollTop < UPPER_THRESHOLD)
			        {
			        	if (tilesComponent.state.scrollingDetectionTopEnabled)
			        	{
			        		console.log("reaching top of page.");

			        		tilesComponent._lastRouteTriggeredPending = true;

			        		tilesActions.addTileUp(tilesComponent.state.nextRouteUp);
			        	}
			        }
		      	}
		    };
	    });
	},
	render: function() {
		let tileRoute,
			tileTopTile,
			tileBottomTile,
			tileAccessedDirectly;

		let tilesComponent = this;

		let tiles = _.map(tilesComponent.state.tileRange, function(index) {
			tileRoute = _.findWhere(tilesComponent.state.mapTileToRoute, {tileIndex: index}).route;
			tileTopTile = (index === tilesComponent.state.tileRange[0]);
			tileBottomTile = (index === tilesComponent.state.tileRange[1]);
			tileAccessedDirectly = (tileRoute === tilesComponent.state.routeAccessedDirectlyFromContent);

			return (<Tile tileIndex={index} 
						  route={tileRoute}  
						  tileExpanded= {tileTopTile || tileAccessedDirectly}
						  firstTile={tileTopTile}
						  lastTile={tileBottomTile}
						  accessedDirectly={tileAccessedDirectly}
						  nextRouteDown={tilesComponent.state.nextRouteDown} />);
		});

		this._addingScrollingDetection(tilesComponent);

		return (
			<div>
				{tiles}
			</div>
		);
	}
});

module.exports = TileHolder;