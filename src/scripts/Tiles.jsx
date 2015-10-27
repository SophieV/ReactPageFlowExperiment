let
  React = require('react'),
  $ = require('jquery'),
  _ = require('underscore'),
  tilesStore = require('./tilesStore'),
  tilesActions = require('./tilesActions'),
  Tile = require('./Tile.jsx');

  import history from './history'

let Tiles = React.createClass({
	getInitialState: function(){
		return {
		  maxTileIndex: tilesStore.getMaxTileIndex(),
		  minTileIndex: tilesStore.getMinTileIndex(),
		  mappingRouteToTile: []
		}
	},
	componentDidMount: function(){
		tilesStore.addChangeListener(this._onTilesDataChanged);

		this._currentRoute = this.props.location.pathname;
		console.log('current route is ' + this._currentRoute);

		this._scrollDetectionEnabled = true;
		console.log('enabling scroll detection.');

		this._onRouteMayHaveChanged(true);

		console.log('new page. reset has reach neutral grounds.');
		this._scrollDetectionInit = false;

		// starting at the top of the viewport ; do nothing
		this._inSensitiveZonePageBottom = false;
		this._inSensitiveZonePageUp = true;
		this._inSensitiveZoneLocked = false;
		this._routeJump = null;
	},
	componentWillUnmount: function(){
		tilesStore.removeChangeListener(this._onTilesDataChanged);
	},
	componentDidUpdate: function() {
		this._onRouteMayHaveChanged(false);
	},
	_onRouteMayHaveChanged: function(init){
		console.log('route may have changed.');

		if (init
		 || this._currentRoute !== this.props.location.pathname 
		 || this._redrawNeeded) {

		 	this._currentRoute = this.props.location.pathname;
		 	console.log('current route is ' + this._currentRoute);

			if (this._ignoreRoute !== this._currentRoute) {

				console.log('route has changed. display the one tile content.');
				
				console.log('new page. reset has reach neutral grounds.');
				this._scrollDetectionInit = false;

				if (!init) {
					this._scrollDetectionEnabled = false;
					console.log('disabling scroll detection.');
				}
				
				tilesActions.addFirstTile(this._currentRoute);

			} else {
					console.log('route change does not reset anything.');

					if (this._scrollingLocked) {
						this._scrollingLocked = false;
						this._enableScrollingDetection();
					}
			}
		} else {
			console.log('route change does not reset anything.');
		}
	},
	_onTilesDataChanged: function(){
		// TODO remove
		let lastRouteLoaded = tilesStore.getLastRoutePopulated();
		if (_.indexOf(lastRouteLoaded, '/') < 0) {
			lastRouteLoaded = '/' + lastRouteLoaded;
		}

		if (this.props.location.pathname !== lastRouteLoaded) {
			// we want to overwrite behavior if we set the route ourselves, not if it was set by a click
			// unless it's already been assigned from the jump to link click
			this._ignoreRoute =  lastRouteLoaded;
		}

		if (this._ignoreRoute === lastRouteLoaded) {
			this._refreshUrlRoute(this._ignoreRoute);
		}

		if (this._routeJump != null) {
			console.log('will now jump to tile #'+ tilesStore.getMaxTileIndex() + ' hosting content #' + this._routeJump);
		}

		console.log('tiles data change. update tiles range [' + tilesStore.getMinTileIndex() + ', ' + tilesStore.getMaxTileIndex() + ']');
		this._inSensitiveZoneLocked = false;

		this.setState({
		  maxTileIndex: tilesStore.getMaxTileIndex(),
		  minTileIndex: tilesStore.getMinTileIndex(),
		  mappingRouteToTile: tilesStore.getRouteToTilesMapping()
		});
	},
	_refreshUrlRoute: function(route){
		history.replaceState(null, route);
	},
	_refreshRouteState: function(route){
		console.log('scrolling back to ' + route);
		this._ignoreRoute = route;
		this._scrollingLocked = true;

		this._scrollDetectionEnabled = false;
		console.log('disabling scroll detection.');

		this._refreshUrlRoute(route);
	},
	_jumpToRoute: function(requestedRoute){
		this._ignoreRoute = "/" + requestedRoute;
		console.log('Let\'s jump to content #' + requestedRoute + ' and ignore upcoming route change.');

		let routeAlreadyLoaded = _.findWhere(this.state.mappingRouteToTile, {route: requestedRoute});

		if (routeAlreadyLoaded != null) {
			console.log('existing content found. scrolling to host tile #' + routeAlreadyLoaded.tileIndex);
			// TODO we need to trigger a state refresh so that the tile can act upon itself.
			this._scrollDetectionEnabled = false;
			this._routeJump = requestedRoute;
			this.setState({'redrawNeeded': true});
		} else {
			console.log('content not found. adding a tile to host it.');
			this._scrollDetectionEnabled = false;
			this._inSensitiveZonePageBottom = true;
			this._inSensitiveZonePageUp = false;
			this._inSensitiveZoneLocked = true; 
			this._routeJump = requestedRoute;
			this._addTiles();
		}
	},
	_enableScrollingDetection : function() {
		let tilesList = this;
		// delaying the effect, so that any undergoing scrolling can finish before
		// otherwise will add a new page because scrolling up enters the upper threshold
		window.setTimeout(
	      () => { 
	      	tilesList._scrollDetectionEnabled = true;
			console.log('enabling scroll detection.'); 
	      },
	      500
	    );
	},
	_addTiles: function(){
		if (this._inSensitiveZoneLocked) {

			if (this._inSensitiveZonePageUp) {

				tilesActions.addTileUp();

			} else if (this._inSensitiveZonePageBottom) {

				tilesActions.addTileDown(this._routeJump);
			}
		}
	},
	render: function() {
		const UPPER_THRESHOLD = 50;

		let tileIndexes = _.range(this.state.minTileIndex, this.state.maxTileIndex + 1);

		let tileComponents = _.map(tileIndexes, currentTileIndex => (
			<Tile tileIndex={currentTileIndex} 
				  route={_.findWhere(this.state.mappingRouteToTile, {tileIndex: currentTileIndex}).route} 
				  minTileIndex={this.state.minTileIndex} 
				  maxTileIndex={this.state.maxTileIndex} 
				  currentRoute={this._currentRoute} 
				  ignoreRoute={this._ignoreRoute} 
				  routeJump={this._routeJump} 
				  jumpToRouteRef={this._jumpToRoute} 
				  refreshRouteStateRef={this._refreshRouteState}
				  enableScrollingDetectionRef={this._enableScrollingDetection} />));

		let tilesList = this;
		$(function($) {
	      let $appContainer = $('#app');

	      window.onscroll = function() {
	      	if (tilesList._scrollDetectionEnabled) {
		      	let thisScrollTop = Math.round($(this).scrollTop()),
		            thisInnerHeight = Math.round($(this).innerHeight()),
		            containeR = window,
		            containeD = document,
		            scrollPercent = 1 * $(containeR).scrollTop() / ($(containeD).height() - $(containeR).height());

		        let lower_threshold = thisScrollTop + thisInnerHeight + 1;
		        if(lower_threshold >= $appContainer.outerHeight())
		        {
		        	if (!tilesList._inSensitiveZonePageBottom)
		        	{
		        		console.log("reaching end of page.");
		        		tilesList._inSensitiveZonePageBottom = true;
		        		tilesList._inSensitiveZonePageUp = false; 
		        		tilesList._inSensitiveZoneLocked = true;
		        		tilesList._routeJump = null;
		        		tilesList._addTiles();
		        	}
		        } 
		        else if(thisScrollTop < UPPER_THRESHOLD)
		        {
		        	if (tilesList._scrollDetectionInit && !tilesList._inSensitiveZonePageUp)
		        	{
		        		console.log("reaching beginning of page.");
		        		tilesList._inSensitiveZonePageUp = true;
		        		tilesList._inSensitiveZonePageBottom = false;
		        		tilesList._inSensitiveZoneLocked = true;
		        		tilesList._routeJump = null;
		        		tilesList._addTiles();
		        	}
		        }
		        else
		        {
		        	if (tilesList._inSensitiveZonePageUp || tilesList._inSensitiveZonePageBottom) {
		        		if (!tilesList._scrollDetectionInit) {
		        			window.setTimeout(
						      () => { 
						      	console.log('initial reach of neutral zone.');
		        				tilesList._scrollDetectionInit = true;
						      },
						      500
						    );
		        		}

		        		console.log('back to neutral zone.');
		        		tilesList._inSensitiveZonePageUp = false;
		        		tilesList._inSensitiveZonePageBottom = false;
		        	}
		        }
	      	} else {
	      		console.log('scroll detection is temporarily disabled.');
	      	}
	      };
	    });

		return (
			<div>
				{tileComponents}
			</div>
		);
	}
});

module.exports = Tiles;