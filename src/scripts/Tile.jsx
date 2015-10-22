let
  React = require('react'),
  JumpButton = require('./JumpButton.jsx');

let Tile = React.createClass({
	componentWillUpdate: function() {
		if (this.props.jumpToContentIndex == null && this.props.index === this.props.minIndex) {
	  		this.shouldScroll = true;
	  		this.minIndexWas = this.props.minIndex;
	  		this.positionBackTo = $(window).scrollTop();
		} else if (this.props.jumpToContentIndex != null) {
			this.jumpToContentIndexWas = this.props.jumpToContentIndex;
		}
	}, 
	componentDidMount: function() {
		if (this.props.contentIndex === this.props.jumpToContentIndex) {
			console.log('i am the new tile added at the bottom, containing the jump content. scroll me to the top of the page.');
			let node = this.getDOMNode();
			$(window).scrollTop(node.offsetTop);
			this.shouldScroll = false;
			this.positionBackTo = null;
			this.props.reEnableScrollingDetectionRef();
		}
	},
	componentDidUpdate: function() {
		if (this.shouldScroll && this.minIndexWas !== this.props.minIndex && (this.routeSingleScrollUpDone === this.props.currentRoute || this.props.ignoreThisRouteChange === this.props.currentRoute)) {
			// only within the same route
			console.log('a new tile has been added above me. scroll back to me.');
			let node = this.getDOMNode();
			// TODO: the offsetHeight to use here is the height of the new tile above - not the current one
			let nodeAboveHeight = node.offsetHeight;
			$(window).scrollTop(this.positionBackTo + nodeAboveHeight);
			this.shouldScroll = false;
			this.positionBackTo = null;
			this.props.reEnableScrollingDetectionRef();
		} else if (this.jumpToContentIndexWas != this.props.jumpToContentIndex && this.props.contentIndex === this.props.jumpToContentIndex) {
			console.log('i am an existing tile containing the jump content. scroll me to the top of the page.');
			let node = this.getDOMNode();
			$(window).scrollTop(node.offsetTop);
			this.shouldScroll = false;
			this.positionBackTo = null;
			this.props.reEnableScrollingDetectionRef();
		} else if (this.minIndex === this.maxIndex && this.props.minIndex === this.props.index && this.routeSingleScrollUpDone !== this.props.currentRoute && this.props.contentIndex === this.props.currentRoute) {
			// we need to check both for a new route AND new content
			// when the route is changed, all the components update ; the tile gets the new route before the tiles list does - and the tiles list is the one triggering the load of the content for the given route...
			console.log('i am the only tile for this route change. scroll me to the top of the page.');
			$(window).scrollTop(0);
			this.routeSingleScrollUpDone = this.props.currentRoute;
			this.shouldScroll = false;
			this.positionBackTo = null;
			this.props.reEnableScrollingDetectionRef();
		}
	},
	_createArticleMarkup: function() { 
		let tile = this;
		return {__html: tile.props.dataToDisplay}; 
	},
	render: function() {
		let classNames = (this.props.index === this.props.minIndex?"content-tile first":(this.props.jumpToContentIndex === this.props.contentIndex?"content-tile jumped":"content-tile"));

		return (
			<div className={classNames}>
				<p>#T{this.props.index} : #C{this.props.contentIndex}</p>
				<div dangerouslySetInnerHTML={this._createArticleMarkup()}></div>
				<JumpButton rangeContentMin={this.props.minIndex - 100} rangeContentMax={this.props.maxIndex + 100} jumpToContentCTARef={this.props.jumpToContentCTARef}/>
			</div>
		);
	}
});

module.exports = Tile;