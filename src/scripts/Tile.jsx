let
  React = require('react'),
  JumpButton = require('./JumpButton.jsx'),
  $ = require('jquery'),
  _ = require('underscore'),
  VisibilitySensor = require('react-visibility-sensor'),
  tilesActions = require('./tilesActions'),
  tilesStore = require('./tilesStore');

let Tile = React.createClass({ 
	componentWillMount: function() {
		if (this.props.tileIndex === 0) {
			// the first tile is always expanded ; the first tile is always index #0
			this._contentInitDone = true;
		} else {
			this._contentInitDone = false;
		}

		// by default the tile checks its visibility status
		this._visibilityDetectionEnabled = true;

		// request content to display in this tile
		tilesActions.loadTileData(this.props.route);
	},
	componentDidMount: function() {
		if (this.props.route === this.props.routeJump) {
			console.log('i am the new tile added at the bottom, containing the jump to content. scroll me to the top of the page.');
			
			// should always be expanded
			this._contentInitDone = true;
			
			this._scrollBackToMe(this.getDOMNode().offsetTop);

			this.props.enableScrollingDetectionRef();
		}
	},
	componentWillUpdate: function() {
		if (this.props.routeJump != null) {
			// make sure we're not jumping back in loop
			this.routeJumpBeforeUpdate = this.props.routeJump;
		} else {
			if (this.props.routeJump == null 
			 && this.props.tileIndex === this.props.minTileIndex) {
				// not going to jump to a tile
				// currently the first tile (not tile before)
				// save info about current tile displayed to jump back to it
		  		this._shouldRestoreScroll = true;
		  		this._minTileIndexBeforeUpdate = this.props.minTileIndex;
		  		this._postionBackTo = $(window).scrollTop();
			}
		}
	},
	componentDidUpdate: function() {
		console.log('single tile component updating.');
		if (this.props.currentRoute !== this._routeAlreadyScrolledTo) {
			//reset, there has been a route change
			this._routeAlreadyScrolledTo = null;
		}

		if (this._pageContent == null) {
			// TODO should be more specific
			this._pageContent = tilesStore.getContent(this.props.route);
		}

		if (this._shouldRestoreScroll 
		 && this._minTileIndexBeforeUpdate !== this.props.minTileIndex 
		 && (this._routeAlreadyScrolledTo === this.props.currentRoute || this.props.ignoreRoute === this.props.currentRoute)) {
			// only within the same route
			console.log('a new tile has been added above me. scroll back to me.');
			// TODO: the offsetHeight to use here is the height of the new tile above - not the current one
			this._scrollBackToMe(this._postionBackTo);// + this.getDOMNode().offsetHeight);

			this.props.enableScrollingDetectionRef();
		} else if (this.routeJumpBeforeUpdate != this.props.routeJump 
				&& this.props.route === this.props.routeJump) {
			console.log('i am an existing tile containing the jump content. scroll me to the top of the page.');
			this._scrollBackToMe(this.getDOMNode().offsetTop);

			this.props.enableScrollingDetectionRef();

		} else if (this.props.minTileIndex === this.props.maxTileIndex 
				&& this.props.minTileIndex === this.props.tileIndex 
				&& this.props.route === this.props.currentRoute
				&& this.props.currentRoute !==  this._routeAlreadyScrolledTo) {
			console.log('i am the only tile for this route change. scroll me to the top of the page.');
			this._scrollBackToMe(this.getDOMNode().offsetTop);
			this._routeAlreadyScrolledTo = this.props.currentRoute;

			this._contentInitDone = true;
			console.log('re-enabling visibility check.');

			this.props.enableScrollingDetectionRef();
		}
	},
	_scrollBackToMe: function(myTop) {
		$(window).scrollTop(myTop);
		this._shouldRestoreScroll = false;
		this._postionBackTo = null;
		this._routeAlreadyScrolledTo = null;
	},
	_onVisibilityChange : function (inViewport) {
	    if (this._visibilityDetectionEnabled) {
	    	// console.log('#T' + this.props.tileIndex + ' is now %s', inViewport ? 'visible' : 'hidden');

	    	if (this._contentInitDone) {
	    		if (inViewport 
	    		 && this.props.route !== this.props.currentRoute) {
			    	// the user is scrolling existing content - up or down
			    	// the route in the status bar does not match the visibility of this specific content. update.
			    	console.log('user scrolling back to ' + this.props.route + '. update navigation accordingly.');
			    	this.props.refreshRouteStateRef(this.props.route);
			    }
	    	} else {
		    	if (inViewport 
		    	 && !this._contentInitDone 
		    	 && this._pageContent != null) {
					window.setTimeout(
				      () => { 
				      	this._contentInitDone = true;
				      	console.log('expanding content once for #T' + this.props.tileIndex);

				      	// redraw content displayed, if the user is not scrolling actively
				      	this.setState({'redrawNeeded': true});
				 
				      	// the content will expand the tile ; scroll back the tile on top of the page ; it may not have been previously if there was not enough content after the anchor (e.g. if the tile loading was the last one)
				      	if (this.props.routeJump === this.props.route) {
				      		console.log('rejump the page because the content is now available');
				      		this._scrollBackToMe(this.getDOMNode().offsetTop);
				      	}
				      },
				      2000
				    );
				}
			}
	    }
	},
	_createArticleMarkup: function() { 
		let tile = this;
		let content;

		if (tile._contentInitDone) {
			if (tile._pageContent != null) {
				content = tile._pageContent;
			} else {
				content = "Loading...";
			}
		} else {
			content = "More Content Here";
		}

		return {__html: content}; 
	},
	_onJumpClick: function(route) {
		this._visibilityDetectionEnabled = false;
		console.log('disable visibility check');

		this.props.jumpToRouteRef(route);
	},
	render: function() {
		let tile = this;
		let tileClassNames = ["content-tile"];

		if (!this._contentInitDone) {
			tileClassNames.push("collapsed");
		} else {
			tileClassNames.push("expanded");

			if (this.props.tileIndex === this.props.minTileIndex) {
				tileClassNames.push("first");
			} else if (this.props.routeJump === this.props.route) {
				tileClassNames.push("jumped");
				this._visibilityDetectionEnabled = true;
				console.log('visibility enabled again.');
			}
		}

		tileClassNames.push("t-" + this.props.tileIndex);

		return (
			<div className={tileClassNames.join(' ')}>
				<div className="page-content">
					<div className="visibility-sensor-up">Visibility Sensor for #T{this.props.tileIndex} #C{this.props.route}
						<VisibilitySensor onChange={this._onVisibilityChange} />
					</div>
					<p>Tile #{this.props.tileIndex} : content of #{this.props.route}</p>
					<div dangerouslySetInnerHTML={this._createArticleMarkup()}></div>
					<JumpButton rangeMin={-100} rangeMax={100} onJumpBtnClickRef={this._onJumpClick}/>
					<div className="visibility-sensor-down">Visibility Sensor for #T{this.props.tileIndex} #C{this.props.route}
						<VisibilitySensor onChange={this._onVisibilityChange} />
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Tile;