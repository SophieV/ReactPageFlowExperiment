let
  React = require('react'),
  JumpButton = require('./JumpButton.jsx'),
  $ = require('jquery'),
  _ = require('underscore'),
  VisibilitySensor = require('react-visibility-sensor');

let Tile = React.createClass({
	_consoleLogTileInfo: function(message) {
		console.log('[' + this.props.tileIndex + ':' + this.props.route + '] ' + message);
	},
	componentDidMount: function() {
		this._positionRestore = 0;
		this._visible = false;
		this._lastRouteScrolledBack = null;
	},
	componentWillUpdate: function() {
		this._positionRestore = this.getDOMNode().offsetTop;
	},
	componentDidUpdate: function() {
		if (this.props.scrollBackToMe && this._lastRouteScrolledBack !== this.props.route) {
			// the scrolling should happen once, not every time some value of the state received has changed
			$(window).scrollTop(this._positionRestore);
			this._consoleLogTileInfo('scrolled window to me');
			this._positionRestore = 0;
			this._lastRouteScrolledBack = this.props.route;
		}
	},
	_onMarkerVisibilityChange: function(isVisible) {
		if (!this.props.lastRouteTriggeredPendingRef && isVisible !== this._visible) {
			this._visible = isVisible;

			if (isVisible) {
				this._consoleLogTileInfo('one of the markers now ' + (isVisible ? 'visible' : 'hidden'));
			}
		}
	},
	_createArticleMarkup: function() { 
		let content;

		if (this.props.tileExpanded) {
			if (this.props.content != null) {
				content = this.props.content;
			} else {
				content = "Loading...";
			}
		} else {
			content = "More Content Coming Here";
		}

		return {__html: content}; 
	},
	render: function() {
		let classNames = ["content-tile"];

		if (this.props.tileExpanded) {
			classNames.push("expanded");
		} else {
			classNames.push("collapsed");
		}

		if (this.props.firstTile) {
			classNames.push("first");
		}

		if (this.props.lastTile) {
			classNames.push("last");
		}

		if (this.props.accessedDirectly) {
			classNames.push("jumped");
		}

		classNames.push("t-" + this.props.tileIndex);

		let bottomCTA,
			upCTA,
			directLinkButton,
			visibilityMarkerUp,
			visibilityMarkerDown;

		if (this.props.firstTile && this.props.content != null && this.props.nextRouteUp != null) {
			upCTA = <h2> There is an up CTA to {this.props.nextRouteUp}</h2>;
		}

		if (this.props.lastTile && this.props.content != null && this.props.nextRouteDown != null) {
			bottomCTA = <h2> There is a bottom CTA to {this.props.nextRouteDown}</h2>;
		}

		if (this.props.content != null) {
			visibilityMarkerUp = (<div className="visibility-sensor-up">Visibility Sensor for #T{this.props.tileIndex} #C{this.props.route}
						<VisibilitySensor onChange={this._onMarkerVisibilityChange} />
					</div>);

			visibilityMarkerDown = (<div className="visibility-sensor-down">Visibility Sensor for #T{this.props.tileIndex} #C{this.props.route}
						<VisibilitySensor onChange={this._onMarkerVisibilityChange} />
					</div>);

			directLinkButton = (<JumpButton rangeMin={-100} rangeMax={100} goToRouteDirectlyRef={this.props.goToRouteDirectlyRef}/>);
		}

		return (
			<div className={classNames.join(' ')}>
				<div className="page-content">
					{visibilityMarkerUp}

					{upCTA}
					
					<p>Tile #{this.props.tileIndex} : content of #{this.props.route}</p>
					<div dangerouslySetInnerHTML={this._createArticleMarkup()}></div>

					{directLinkButton}

					{visibilityMarkerDown}
					
					{bottomCTA}
					
				</div>
			</div>
		);
	}
});

module.exports = Tile;