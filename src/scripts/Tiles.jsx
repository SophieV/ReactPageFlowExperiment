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
		  maxTileIndex: tilesStore.getTilesDownCount(),
		  minTileIndex: tilesStore.getTilesUpCount(),
		  // TODO move to tile
		  mappingContentToTile: []
		}
	},
	componentDidMount: function(){
		tilesStore.addChangeListener(this._onTilesDataChanged);

		this.currentRoute = this.props.location.pathname;
		console.log('current route is ' + this.currentRoute);

		this.scrollDetectionEnabled = true;
		console.log('enabling scroll detection.');

		this._onRouteMayHaveChanged(true);

		console.log('new page. reset has reach neutral grounds.');
		this.notInScrollingSensitiveZone_once = false;

		// starting at the top of the viewport ; do nothing
		this.isInScrollingSensitiveZone_down = false;
		this.isInScrollingSensitiveZone_up = true;
		this.isInScrollingSensitiveZone_actionCompleted = true;
		this.jumpToRouteValue = null;
	},
	componentWillUnmount: function(){
		tilesStore.removeChangeListener(this._onTilesDataChanged);
	},
	componentDidUpdate: function() {
		this._onRouteMayHaveChanged(false);
	},
	_onRouteMayHaveChanged: function(init){
		let tilesList = this;

		if (init || tilesList.currentRoute !== tilesList.props.location.pathname) {

			if (tilesList.ignoreRouteChangedTo !== tilesList.props.location.pathname) {

				console.log('route has changed. display the one tile content.');
				tilesList.currentRoute = tilesList.props.location.pathname;
				console.log('current route is ' + tilesList.currentRoute);

				console.log('new page. reset has reach neutral grounds.');
				tilesList.notInScrollingSensitiveZone_once = false;

				if (!init) {
					tilesList.scrollDetectionEnabled = false;
					console.log('disabling scroll detection.');
				}
				
				tilesActions.addFirstTile(tilesList.props.location.pathname);

			} else {

					tilesList.currentRoute = tilesList.props.location.pathname;
					console.log('route change does not reset anything.');
			}
		} else {
			console.log('route change does not reset anything.');
		}
	},
	_onTilesDataChanged: function(){
		let tilesList = this;

		let lastRouteLoaded = tilesStore.getLastContentIndexGenerated();
		if (_.indexOf(lastRouteLoaded, '/') < 0) {
			lastRouteLoaded = '/' + lastRouteLoaded;
		}

		if (this.props.location.pathname !== lastRouteLoaded) {
			// we want to overwrite behavior if we set the route ourselves, not if it was set by a click
			// unless it's already been assigned from the jump to link click
			this.ignoreRouteChangedTo =  lastRouteLoaded;
		}

		if (this.ignoreRouteChangedTo === lastRouteLoaded) {
			this._updateRouteDisplayedToUser(this.ignoreRouteChangedTo);
		}

		if (tilesList.jumpToRouteValue != null) {
			console.log('will now jump to tile #'+ tilesStore.getTilesDownCount() + ' hosting content #' + tilesList.jumpToRouteValue);
		}

		console.log('tiles data change. update tiles range to  [' + tilesStore.getTilesDownCount() + ', ' + tilesStore.getTilesUpCount() + ']');
		tilesList.isInScrollingSensitiveZone_actionCompleted = true;

		tilesList.setState({
		  maxTileIndex: tilesStore.getTilesDownCount(),
		  minTileIndex: tilesStore.getTilesUpCount(),
		  mappingContentToTile: tilesStore.getContentToTilesMapping()
		});
	},
	_updateRouteDisplayedToUser: function(routeValue){
		history.replaceState(null, routeValue);
	},
	_jumpToRoute: function(requestedRoute){
		let tilesList = this;
		tilesList.ignoreRouteChangedTo = "/" + requestedRoute;
		console.log('Let\'s jump to content #' + requestedRoute + 'and ignore upcoming route change.');

		let routeAlreadyLoaded = _.findWhere(tilesList.state.mappingContentToTile, {contentIndex: requestedRoute});

		if (routeAlreadyLoaded != null) {
			console.log('existing content found. scrolling to host tile #' + routeAlreadyLoaded.tileIndex);
			// TODO we need to trigger a state refresh so that the tile can act upon itself.
			tilesList.scrollDetectionEnabled = false;
			tilesList.jumpToRouteValue = requestedRoute;
			tilesList.setState({redrawNeeded: true});
		} else {
			console.log('content not found. adding a tile to host it.');
			tilesList.scrollDetectionEnabled = false;
			tilesList.isInScrollingSensitiveZone_down = true;
			tilesList.isInScrollingSensitiveZone_up = false;
			tilesList.isInScrollingSensitiveZone_actionCompleted = false; 
			tilesList.jumpToRouteValue = requestedRoute;
			tilesList._addTiles();
		}
	},
	_reEnableScrollingDetection : function() {
		let tilesList = this;
		// delaying the effect, so that any undergoing scrolling can finish before
		// otherwise will add a new page because scrolling up enters the upper threshold
		window.setTimeout(
	      () => { 
	      	tilesList.scrollDetectionEnabled = true;
			console.log('enabling scroll detection.'); 
	      },
	      500
	    );
	},
	_addTiles: function(){
		let tilesList = this;
		if (!tilesList.isInScrollingSensitiveZone_actionCompleted) {

			if (tilesList.isInScrollingSensitiveZone_up) {

				tilesActions.addTileUp();

			} else if (tilesList.isInScrollingSensitiveZone_down) {

				tilesActions.addTileDown(tilesList.jumpToRouteValue);
			}
		}
	},
	render: function() {
		let tilesList = this;
		const UPPER_THRESHOLD = 50;

		let tileIndexes = _.range(this.state.minTileIndex, this.state.maxTileIndex + 1);

		let tileComponents = _.map(tileIndexes, currentTileIndex => (
			<Tile tileIndex={currentTileIndex} 
				  contentRoute={_.findWhere(tilesList.state.mappingContentToTile, {tileIndex: currentTileIndex}).contentIndex} 
				  minTileIndex={this.state.minTileIndex} 
				  maxTileIndex={this.state.maxTileIndex} 
				  currentRoute={this.props.location.pathname} 
				  ignoreRouteChangedTo={this.ignoreRouteChangedTo} 
				  jumpToRouteValue={this.jumpToRouteValue} 
				  jumpToRouteRef={this._jumpToRoute} 
				  reEnableScrollingDetectionRef={this._reEnableScrollingDetection} 
				dataToDisplay={tilesStore.getContentFromIndex(_.findWhere(tilesList.state.mappingContentToTile, {tileIndex: currentTileIndex}).contentIndex)} />));

		$(function($) {
	      let $appContainer = $('#app');

	      window.onscroll = function() {
	      	if (tilesList.scrollDetectionEnabled) {
		      	let thisScrollTop = Math.round($(this).scrollTop()),
		            thisInnerHeight = Math.round($(this).innerHeight()),
		            containeR = window,
		            containeD = document,
		            scrollPercent = 1 * $(containeR).scrollTop() / ($(containeD).height() - $(containeR).height());

		        let lower_threshold = thisScrollTop + thisInnerHeight + 1;
		        if(lower_threshold >= $appContainer.outerHeight())
		        {
		        	if (!tilesList.isInScrollingSensitiveZone_down)
		        	{
		        		console.log("reaching end of page.");
		        		tilesList.isInScrollingSensitiveZone_down = true;
		        		tilesList.isInScrollingSensitiveZone_up = false; 
		        		tilesList.isInScrollingSensitiveZone_actionCompleted = false;
		        		tilesList.jumpToRouteValue = null;
		        		tilesList._addTiles();
		        	}
		        } 
		        else if(thisScrollTop < UPPER_THRESHOLD)
		        {
		        	if (tilesList.notInScrollingSensitiveZone_once && !tilesList.isInScrollingSensitiveZone_up)
		        	{
		        		console.log("reaching beginning of page.");
		        		tilesList.isInScrollingSensitiveZone_up = true;
		        		tilesList.isInScrollingSensitiveZone_down = false;
		        		tilesList.isInScrollingSensitiveZone_actionCompleted = false;
		        		tilesList.jumpToRouteValue = null;
		        		tilesList._addTiles();
		        	}
		        }
		        else
		        {
		        	if (tilesList.isInScrollingSensitiveZone_up || tilesList.isInScrollingSensitiveZone_down) {
		        		if (!tilesList.notInScrollingSensitiveZone_once) {
		        			window.setTimeout(
						      () => { 
						      	console.log('initial reach of neutral zone.');
		        				tilesList.notInScrollingSensitiveZone_once = true;
						      },
						      500
						    );
		        		}

		        		console.log('back to neutral zone.');
		        		tilesList.isInScrollingSensitiveZone_up = false;
		        		tilesList.isInScrollingSensitiveZone_down = false;
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