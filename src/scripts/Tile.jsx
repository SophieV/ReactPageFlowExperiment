let
  React = require('react'),
  JumpButton = require('./JumpButton.jsx'),
  $ = require('jquery'),
  _ = require('underscore'),
  VisibilitySensor = require('react-visibility-sensor');

let Tile = React.createClass({
	componentWillUpdate: function() {
		if (this.props.jumpToRouteValue == null && this.props.tileIndex === this.props.minTileIndex) {
	  		this.shouldScroll = true;
	  		this.minTileIndex_previous = this.props.minTileIndex;
	  		this.positionBackTo = $(window).scrollTop();
		} else if (this.props.jumpToRouteValue != null) {
			this.jumpToRouteValue_previous = this.props.jumpToRouteValue;
		}
	}, 
	componentDidMount: function() {
		const MARGIN_TOP_NAVBAR = 55; //TODO : how to define in vh instead of px ?
		if (this.props.contentRoute === this.props.jumpToRouteValue) {
			console.log('i am the new tile added at the bottom, containing the jump content. scroll me to the top of the page.');
			let node = this.getDOMNode();
			$(window).scrollTop(node.offsetTop - MARGIN_TOP_NAVBAR);
			this.shouldScroll = false;
			this.positionBackTo = null;
			this.scrollUpDoneForRouteValue = null;

			this.props.reEnableScrollingDetectionRef();
		}
	},
	componentDidUpdate: function() {
		console.log('single tiles updating.');
		if (this.props.currentRoute !== this.scrollUpDoneForRouteValue) {
			//reset
			this.scrollUpDoneForRouteValue = null;
		}

		if (this.shouldScroll 
		 && this.minTileIndex_previous !== this.props.minTileIndex 
		 && (this.scrollUpDoneForRouteValue === this.props.currentRoute || this.props.ignoreRouteChangedTo === this.props.currentRoute)) {
			// only within the same route
			console.log('a new tile has been added above me. scroll back to me.');
			let node = this.getDOMNode();
			// TODO: the offsetHeight to use here is the height of the new tile above - not the current one
			let nodeAboveHeight = node.offsetHeight;
			$(window).scrollTop(this.positionBackTo + nodeAboveHeight);
			this.shouldScroll = false;
			this.positionBackTo = null;
			this.scrollUpDoneForRouteValue = null;

			this.props.reEnableScrollingDetectionRef();
		} else if (this.jumpToRouteValue_previous != this.props.jumpToRouteValue 
				&& this.props.contentRoute === this.props.jumpToRouteValue) {
			console.log('i am an existing tile containing the jump content. scroll me to the top of the page.');
			let node = this.getDOMNode();
			$(window).scrollTop(node.offsetTop);
			this.shouldScroll = false;
			this.positionBackTo = null;
			this.scrollUpDoneForRouteValue = null;

			this.props.reEnableScrollingDetectionRef();
		} else if (this.props.minTileIndex === this.props.maxTileIndex 
				&& this.props.minTileIndex === this.props.tileIndex 
				&& this.scrollUpDoneForRouteValue !== this.props.currentRoute 
				&& this.props.contentRoute === this.props.currentRoute) {
			// we need to check both for a new route AND new content
			// when the route is changed, all the components update ; the tile gets the new route before the tiles list does - and the tiles list is the one triggering the load of the content for the given route...
			console.log('i am the only tile for this route change. scroll me to the top of the page.');
			$(window).scrollTop(0);
			this.scrollUpDoneForRouteValue = this.props.currentRoute;
			this.shouldScroll = false;
			this.positionBackTo = null;

			this.props.reEnableScrollingDetectionRef();
		}
	},
	onVisibilityChange : function (isVisible) {
		let routeValue = this.props.contentRoute;
		if (_.indexOf(routeValue, '/') < 0) {
			routeValue = '/' + routeValue;
		}
	    console.log('Element #T' + this.props.tileIndex + ' is now %s', isVisible ? 'visible' : 'hidden');
	    if (isVisible
	    	&& routeValue !== this.props.currentRoute) {
	    	// the user is scrolling existing content - up or down
	    	console.log('user scrolling back to ' + routeValue + '. Update navigation accordingly.');
	    	this.props.showPageBeingScrolledBackToRef(routeValue);
	    }
	  },
	_createArticleMarkup: function() { 
		let tile = this;
		return {__html: tile.props.dataToDisplay}; 
	},
	render: function() {
		let tile = this;
		let classNames = (this.props.tileIndex === this.props.minTileIndex?"content-tile first":(this.props.jumpToRouteValue === this.props.contentRoute?"content-tile jumped":"content-tile"));

		return (
			<div className={classNames}>
				<div className="page-content">
					<div className="visibility-sensor">Visibility Sensor for #T{this.props.tileIndex}
						<VisibilitySensor onChange={this.onVisibilityChange} />
					</div>
					<p>Tile #{this.props.tileIndex} : content of #{this.props.contentRoute}</p>
					<div dangerouslySetInnerHTML={this._createArticleMarkup()}></div>
					<JumpButton rangeContentRouteMin={-100} rangeContentRouteMax={100} jumpToRouteRef={this.props.jumpToRouteRef}/>
				</div>
			</div>
		);
	}
});

module.exports = Tile;