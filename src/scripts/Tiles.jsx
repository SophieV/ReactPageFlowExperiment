let
  React = require('react'),
  $ = require('jquery'),
  _ = require('underscore'),
  tilesStore = require('./tilesStore'),
  contentStore = require('./contentStore'),
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
	nextRouteUp: tilesStore.nextRouteUp(),
	currentRouteTileShouldScrollToTop: tilesStore.currentRouteTileShouldScrollToTop(),
	previousRouteTileShouldScrollToTop: tilesStore.previousRouteTileShouldScrollToTop()
  };
}

let TileHolder = React.createClass({
	getInitialState: function(){
		return getTileHolderState(this.props);
	},
	componentDidMount: function(){
		tilesStore.addChangeListener(this._onTilesInfoChanged);
		// warning message of too many event listeners if located in Tile
		contentStore.addChangeListener(this._onContentDataChanged);

		this._initDone = false;
		this._lastBrowserRoute = null;

		this._onRouteMayHaveChanged();
	},
	componentWillUnmount: function(){
		tilesStore.removeChangeListener(this._onTilesInfoChanged);
		contentStore.removeChangeListener(this._onContentDataChanged);
	},
	componentDidUpdate: function() {
		this._onRouteMayHaveChanged();
	},
	_updateRouteDisplayedToUser: function(routeValue){
		history.replaceState(null, routeValue);
	},
	_onRouteMayHaveChanged: function(init){
		let browserUrl = this.props.location.pathname;

		// TODO what if next or previous is the same link ?! and it was accessed by the navbar directly
		let userTriggered = (browserUrl === this.state.routeIgnored || browserUrl === this.state.nextRouteDown || browserUrl === this.state.nextRouteUp || browserUrl === this.state.routeAccessedDirectlyFromContent);

		if (!this._initDone || (browserUrl !== this._lastBrowserRoute && browserUrl !== this.state.lastRouteRequested && !userTriggered)) {
			this._initDone = true;
			tilesActions.addFirstTile(browserUrl);
		}

		this._lastBrowserRoute = browserUrl;
	},
	_onTilesInfoChanged: function(){
		let newState = getTileHolderState(this.props);
    	this.setState(newState);

    	let browserUrl = this.props.location.pathname;

    	if (this._initDone && browserUrl !== newState.lastRouteRequested && newState.lastRouteRequested === newState.routeIgnored) {
    		this._updateRouteDisplayedToUser(newState.routeIgnored);
    	}
	},
	_onContentDataChanged: function() {
		// trigger redraw ; the content store is accessed directly for each tile
		this.setState({'redrawNeeded': true});
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
			topTileContentLoaded,
			tileBottomTile,
			tileAccessedDirectly,
			tileContent,
			tileSingleTile,
			tileShouldScrollTop;

		let tilesComponent = this;

		topTileContentLoaded = false;

		if (tilesComponent.state.tileRange.length > 0) {
			topTileContentLoaded = (contentStore.routeContent(_.findWhere(tilesComponent.state.mapTileToRoute, {tileIndex: tilesComponent.state.tileRange[0]}).route) != null);
		}

		let tiles = _.map(tilesComponent.state.tileRange, function(index) {

			tileRoute = _.findWhere(tilesComponent.state.mapTileToRoute, {tileIndex: index}).route;

			tileSingleTile = (index === tilesComponent.state.tileRange[0] && tilesComponent.state.tileRange.length === 1);

			tileTopTile = (index === tilesComponent.state.tileRange[0]);

			tileBottomTile = ((index === tilesComponent.state.tileRange[tilesComponent.state.tileRange.length-1]) || (tilesComponent.state.tileRange.length === 1 && index === tilesComponent.state.tileRange[0]));
			
			tileAccessedDirectly = (tileRoute === tilesComponent.state.routeAccessedDirectlyFromContent);

			tileContent = contentStore.routeContent(tileRoute);

			tileShouldScrollTop = false;

			if (tileRoute === tilesComponent.state.lastRouteRequested) {
				tilesComponent._lastRouteTriggeredPending = (tileContent == null);

				tileShouldScrollTop = tilesComponent.state.currentRouteTileShouldScrollToTop;
			}

			if (tilesComponent.state.previousRouteTileShouldScrollToTop && index === tilesComponent.state.tileRange[1] && topTileContentLoaded) {
				// scroll only once the content of the tile above has been loaded - it's what's causing the jump in the page
				tileShouldScrollTop = true;
			}

			return (<Tile tileIndex={index} 
						  route={tileRoute} 
						  content={tileContent} 
						  tileExpanded= {tileContent != null || tileSingleTile || tileAccessedDirectly}
						  firstTile={tileTopTile}
						  lastTile={tileBottomTile}
						  accessedDirectly={tileAccessedDirectly}
						  scrollBackToMe={tileShouldScrollTop}
						  nextRouteDown={tilesComponent.state.nextRouteDown}
						  nextRouteUp={tilesComponent.state.nextRouteUp}
						  lastRouteTriggeredPendingRef={tilesComponent._lastRouteTriggeredPending} />);

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