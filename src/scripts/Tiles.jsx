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
		  // layout: JSON.parse($('.config-data').text()).layout,
		  countAfter: tilesStore.getTilesDownCount(),
		  countBefore: tilesStore.getTilesUpCount(),
		  //we're starting at the top of the page
		  isInSensitiveZone_up: true,
		  isInSensitiveZone_down: false,
		  // we cannot both update the state and take action - otherwise the state used after the action will not be refreshed to what we expect
		  isInSensitiveZone_actionTaken: true,
		  jumpToContentIndex: null,
		  mappingContentToTile: []
		}
	},
	componentDidMount: function(){
		tilesStore.addChangeListener(this._onTilesDataChanged);
		// tilesActions.addTileDown();
		this.currentRoute = this.props.location.pathname;
		console.log('current route is ' + this.currentRoute);
		this.scrollDetectionEnabled = true;
		console.log('enabling scroll detection.');
		this._onRouteChanged(true);
		console.log('new page. reset has reach neutral grounds.');
		this.hasReachedNeutralGroundsOnce = false;
	},
	componentWillUnmount: function(){
		tilesStore.removeChangeListener(this._onTilesDataChanged);
	},
	componentDidUpdate: function() {
		if (!this.state.isInSensitiveZone_actionTaken) {
			if (this.state.isInSensitiveZone_up) {
				tilesActions.addTileUp();
			} else if (this.state.isInSensitiveZone_down) {
				tilesActions.addTileDown(this.state.jumpToContentIndex);
			}
		} else {
			// regardless of whether same route name
			this._onRouteChanged(false);
		}
	},
	_onRouteChanged: function(firstCall){
		let tilesList = this;

		if (firstCall || tilesList.props.location.pathname !== tilesList.currentRoute) {
			if (tilesList.ignoreThisRouteChange !== tilesList.props.location.pathname) {
				console.log('route has changed. display the one tile content.');
				tilesList.currentRoute = tilesList.props.location.pathname;
				console.log('current route is ' + tilesList.currentRoute);

				console.log('new page. reset has reach neutral grounds.');
				tilesList.hasReachedNeutralGroundsOnce = false;

				if (!firstCall) {
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

		let lastContentRetrieved = tilesStore.getLastContentIndexGenerated();
		if (_.indexOf(lastContentRetrieved, '/') < 0) {
			lastContentRetrieved = '/' + lastContentRetrieved;
		}

		if (this.props.location.pathname !== lastContentRetrieved) {
			// we want to overwrite behavior if we set the route ourselves, not if it was set by a click
			// unless it's already been assigned from the jump to link click
			this.ignoreThisRouteChange =  lastContentRetrieved;
		}

		if (this.ignoreThisRouteChange === lastContentRetrieved) {
			history.replaceState(null, this.ignoreThisRouteChange);
		}

		if (tilesList.state.jumpToContentIndex !== null) {
			console.log('will now jump to #T'+ tilesStore.getTilesDownCount() + ' hosting #C' + tilesList.state.jumpToContentIndex);
		}

		console.log('tiles data change. update counts after/before to respectively ' + tilesStore.getTilesDownCount() + ', ' + tilesStore.getTilesUpCount());
		tilesList.setState({
		  countAfter: tilesStore.getTilesDownCount(),
		  countBefore: tilesStore.getTilesUpCount(),
		  mappingContentToTile: tilesStore.getContentToTilesMapping(),
		  'isInSensitiveZone_actionTaken': true
		});
	},
	_jumpToContentCTA: function(requestedContentIndex){
		let tilesList = this;
		tilesList.ignoreThisRouteChange = "/" + requestedContentIndex;
		console.log('Let\'s jump to #C' + requestedContentIndex + 'and ignore upcoming route change.');

		let contentAlreadyDisplayed = _.findWhere(tilesList.state.mappingContentToTile, {contentIndex: requestedContentIndex});

		if (contentAlreadyDisplayed != null) {
			console.log('existing content found. scrolling to host tile #T' + contentAlreadyDisplayed.tileIndex);
			// we need to trigger a state refresh so that the tile can highlight itself.
			tilesList.scrollDetectionEnabled = false;
			tilesList.setState({'jumpToContentIndex': requestedContentIndex});
		} else {
			console.log('content not found. adding a tile to host it.');
			tilesList.scrollDetectionEnabled = false;
			tilesList.setState({'isInSensitiveZone_down': true,
								'isInSensitiveZone_up': false,
								'isInSensitiveZone_actionTaken': false, 
								'jumpToContentIndex': requestedContentIndex});
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
	render: function() {
		let tilesList = this;
		const UPPER_THRESHOLD = 50;

		let tileIndexes = _.range(this.state.countBefore, this.state.countAfter + 1);

		let tileComponents = _.map(tileIndexes, currentTileIndex => (
			<Tile index={currentTileIndex} 
				  contentIndex={_.findWhere(tilesList.state.mappingContentToTile, {tileIndex: currentTileIndex}).contentIndex} 
				  minIndex={this.state.countBefore} 
				  maxIndex={this.state.countAfter} 
				  currentRoute={this.props.location.pathname} 
				  ignoreThisRouteChange={this.ignoreThisRouteChange} 
				  dataToDisplay={tilesStore.getContentFromIndex(_.findWhere(tilesList.state.mappingContentToTile, {tileIndex: currentTileIndex}).contentIndex)} 
				  jumpToContentIndex={this.state.jumpToContentIndex} 
				  jumpToContentCTARef={this._jumpToContentCTA}
				  reEnableScrollingDetectionRef={this._reEnableScrollingDetection}/>));

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
		        	if (!tilesList.state.isInSensitiveZone_down)
		        	{
		        		console.log("reaching end of page.");
		        		tilesList.setState({'isInSensitiveZone_down': true,
		        							'isInSensitiveZone_up': false, 
		        							'isInSensitiveZone_actionTaken': false,
		        							'jumpToContentIndex': null});
		        	}
		        } 
		        else if(thisScrollTop < UPPER_THRESHOLD)
		        {
		        	if (tilesList.hasReachedNeutralGroundsOnce && !tilesList.state.isInSensitiveZone_up)
		        	{
		        		console.log("reaching beginning of page.");
		        		tilesList.setState({'isInSensitiveZone_up': true,
		        							'isInSensitiveZone_down': false,
		        							'isInSensitiveZone_actionTaken': false,
		        							'jumpToContentIndex': null});
		        	}
		        }
		        else
		        {
		        	if (tilesList.state.isInSensitiveZone_up || tilesList.state.isInSensitiveZone_down) {
		        		if (!tilesList.hasReachedNeutralGroundsOnce) {
		        			window.setTimeout(
						      () => { 
						      	console.log('initial reach of neutral grounds.');
		        				tilesList.hasReachedNeutralGroundsOnce = true;
						      },
						      500
						    );
		        		}

		        		console.log('back neutral grounds.');
		        		tilesList.setState({'isInSensitiveZone_up': false, 
		        						'isInSensitiveZone_down': false});
		        	}
		        }
	      	} else {
	      		console.log('a tile is being accessed.');
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