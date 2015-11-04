let
  React = require('react'),
  $ = require('jquery'),
  _ = require('underscore'),
  tilesStore = require('../fluxStores/tilesStore'),
  contentStore = require('../fluxStores/contentStore'),
  contentActions = require('../fluxStores/contentActions'),
  tilesActions = require('../fluxStores/tilesActions'),
  Tile = require('./RouteTile.jsx');

  import history from '../history'

function getTileHolderState(lastRouteTriggeredPendingValue, previousRouteRequestedValue) {
  return {
  lastRouteTriggeredPending: lastRouteTriggeredPendingValue,
  previousRouteRequested: previousRouteRequestedValue,
	tilesIndexRange: _.range(tilesStore.minTileIndex(), tilesStore.maxTileIndex() + 1),
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

let RouteTilesManager = React.createClass({
  propTypes: {
    UPPER_THRESHOLD: React.PropTypes.number
  },
  getDefaultProps: function() {
    return {
      UPPER_THRESHOLD: 50 //px
    };
  },
	getInitialState: function(){
		return getTileHolderState(false, null);
	},
	componentDidMount: function(){
		tilesStore.addChangeListener(this._onTilesInfoChanged);
		contentStore.addChangeListener(this._onContentDataChanged);

		this._onRouteMayHaveChanged(true);
	},
	componentDidUpdate: function() {
		if (!this.state.lastRouteTriggeredPending) {
      this._onRouteMayHaveChanged(false);
    } else {
      if (this.state.lastRouteRequested != null) {
        let actionStillUnderWork = (contentStore.routeContent(this.state.lastRouteRequested) == null);
        console.log('action still undergoing: ' + actionStillUnderWork);

        if (this.state.lastRouteTriggeredPending !== actionStillUnderWork) {
          this.setState({lastRouteTriggeredPending : actionStillUnderWork});
        }
      }
    }
	},
  componentWillUnmount: function(){
    tilesStore.removeChangeListener(this._onTilesInfoChanged);
    contentStore.removeChangeListener(this._onContentDataChanged);
    this.context.router.getLocation().removeChangeListener(this._onRouteMayHaveChanged);
  },
	_updateRouteDisplayedToUser: function(routeValue){
		history.replaceState(null, routeValue);
	},
	_onRouteMayHaveChanged: function(init){
		let browserUrl = this.props.location.pathname;

		if (init === true || browserUrl !== this.state.lastRouteRequested && browserUrl !== this.state.routeIgnored && browserUrl !== this.state.previousRouteRequested) {
			tilesActions.addFirstTile(browserUrl);
		}
	},
	_onTilesInfoChanged: function(){
		let newState = getTileHolderState(this.state.lastRouteTriggeredPending, this.state.lastRouteRequested);
    	this.setState(newState);

    	let browserUrl = this.props.location.pathname;

    	if (browserUrl !== newState.lastRouteRequested && newState.lastRouteRequested === newState.routeIgnored) {
    		this._updateRouteDisplayedToUser(newState.routeIgnored);
    	}
	},
  _onContentDataChanged: function() {
    // trigger redraw ; the content store is accessed directly for each tile
    this.setState({'redrawNeeded': true});
  },
  _handleTileVisibilityChange: function(route) {
    if (this.props.location.pathname !== route) {
      tilesActions.routeBeingViewed(route);
    }
  },
	_handleGoToRouteDirectlyClick: function(requestedRoute) {
		let routeAlreadyInView = false;
		let assignedTileEntry = _.findWhere(this.state.mapTileToRoute, {route: requestedRoute});

		if (assignedTileEntry != null) {
			tilesActions.goToExistingRoute(requestedRoute);
		} else {
			tilesActions.goToRoute(requestedRoute);
		}
	},
	_addScrollingDetection: function(tilesComponent) {
		$(function($) {
	      	let $appContainer = $('#app');

	      	window.onscroll = function() {
		      	if (tilesComponent.state.scrollingDetectionEnabled && !tilesComponent.state.lastRouteTriggeredPending) {

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

			        		tilesComponent.setState({lastRouteTriggeredPending : true, previousRouteRequested: tilesComponent.state.lastRouteRequested, lastRouteRequested: tilesComponent.state.nextRouteDown});

			        		tilesActions.addTileDown(tilesComponent.state.nextRouteDown);
			        	}
			        }
			        else if(thisScrollTop < tilesComponent.props.UPPER_THRESHOLD)
			        {
			        	if (tilesComponent.state.scrollingDetectionTopEnabled)
			        	{
			        		console.log("reaching top of page.");

			        		tilesComponent.setState({lastRouteTriggeredPending : true, previousRouteRequested: tilesComponent.state.lastRouteRequested, lastRouteRequested: tilesComponent.state.nextRouteUp});

			        		tilesActions.addTileUp(tilesComponent.state.nextRouteUp);
			        	}
			        }
		      	}
		    };
	    });
	},
	render: function() {
		let tileRoute,
  			tileIsFirst,
  			topTileContentLoaded,
  			tileIsLast,
  			tileAccessedDirectly,
  			tileContent,
  			tileIsSingle,
  			tileShouldScrollTop;

		topTileContentLoaded = false;

		if (this.state.tilesIndexRange.length > 0) {
			topTileContentLoaded = (contentStore.routeContent(_.findWhere(this.state.mapTileToRoute, {tileIndex: this.state.tilesIndexRange[0]}).route) != null);
		}

		console.log('tile range is : ' + this.state.tilesIndexRange);

		let tilesComponent = this;

		let tiles = _.map(tilesComponent.state.tilesIndexRange, function(index) {

			tileRoute = _.findWhere(tilesComponent.state.mapTileToRoute, {tileIndex: index}).route;

			tileIsSingle = (index === tilesComponent.state.tilesIndexRange[0] && tilesComponent.state.tilesIndexRange.length === 1);

			tileIsFirst = (index === tilesComponent.state.tilesIndexRange[0]);

			tileIsLast = ((index === tilesComponent.state.tilesIndexRange[tilesComponent.state.tilesIndexRange.length-1]) || (tilesComponent.state.tilesIndexRange.length === 1 && index === tilesComponent.state.tilesIndexRange[0]));

			tileAccessedDirectly = (tileRoute === tilesComponent.state.routeAccessedDirectlyFromContent);

			tileContent = contentStore.routeContent(tileRoute);

			tileShouldScrollTop = false;

			if (tileRoute === tilesComponent.state.lastRouteRequested && tilesComponent.state.currentRouteTileShouldScrollToTop) {
				tileShouldScrollTop = true;
			}

			if (tilesComponent.state.previousRouteTileShouldScrollToTop && index === tilesComponent.state.tilesIndexRange[1] && topTileContentLoaded) {
				// scroll only once the content of the tile above has been loaded - it's what's causing the jump in the page
				// tileShouldScrollTop = true;
			}

			return (<Tile key={index}
                    tileIndex={index}
      						  isNewPageReset={tilesComponent.state.routeIgnored == null}
      						  route={tileRoute}
      						  content={tileContent}
      						  isExpanded= {tileContent != null || tileIsSingle || tileAccessedDirectly}
      						  isFirstTile={tileIsFirst}
      						  isLastTile={tileIsLast}
      						  isAccessedDirectly={tileAccessedDirectly}
      						  isScrolledTo={tileShouldScrollTop}
      						  nextRouteDown={tilesComponent.state.nextRouteDown}
      						  nextRouteUp={tilesComponent.state.nextRouteUp}
      						  lastRouteTriggeredPending={tilesComponent.state.lastRouteTriggeredPending}
      						  handleGoToRouteDirectlyClick={tilesComponent._handleGoToRouteDirectlyClick}
      						  handleTileVisibilityChange={tilesComponent._handleTileVisibilityChange} />);

		});

		this._addScrollingDetection(tilesComponent);

		return (
			<div>
				{tiles}
			</div>
		);
	}
});

module.exports = RouteTilesManager;
