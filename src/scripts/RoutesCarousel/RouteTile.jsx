let
  React = require('react'),
  JumpButton = require('../UiElements/JumpButton.jsx'),
  PageHome = require('../PageViews/PageHome.jsx'),
  PageWork = require('../PageViews/PageWork.jsx'),
  PageDefault = require('../PageViews/PageDefault.jsx'),
  $ = require('jquery'),
  _ = require('underscore'),
  VisibilitySensor = require('react-visibility-sensor');

let RouteTile = React.createClass({
	_consoleLogTileInfo: function(message) {
		console.log('[' + this.props.tileIndex + ':' + this.props.route + '] ' + message);
	},
	componentDidMount: function() {
		this._positionRestore = 0;
		this._visible = false;
		this._lastRouteScrolledBack = null;
		this._toggleVisibilitySensor(false);
	},
	componentWillUpdate: function() {
		this._positionRestore = this.getDOMNode().offsetTop;
		this._toggleVisibilitySensor(false);
	},
	componentDidUpdate: function() {
		this._consoleLogTileInfo("i received still ongoing action : " + this.props.lastRouteTriggeredPendingRef);
		this._toggleVisibilitySensor(!this.props.lastRouteTriggeredPendingRef);

		if (this.props.scrollBackToMe && (this._lastRouteScrolledBack !== this.props.route || this.props.newPageReset)) {
			// the scrolling should happen once, not every time some value of the state received has changed
			$(window).scrollTop(this._positionRestore);
			this._consoleLogTileInfo('scrolled window to me');
			this._positionRestore = 0;
			this._lastRouteScrolledBack = this.props.route;
		}
	},
	_toggleVisibilitySensor: function(active) {
		VisibilitySensor.active = active;
		this._consoleLogTileInfo("visibility sensor is active : " + VisibilitySensor.active);
	},
	_onMarkerVisibilityChange: function(isVisible) {
		if (!this.props.lastRouteTriggeredPendingRef && isVisible !== this._visible) {
			this._visible = isVisible;

			if (isVisible) {
				this._consoleLogTileInfo('one of the markers now ' + (isVisible ? 'visible' : 'hidden'));
				this.props.onTileVisibilityChangeRef(this.props.route);
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

		let pageContent,
			bottomCTA,
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

		switch(this.props.route) {
			case "/home":
				pageContent = <PageHome contentReady={this.props.content != null} content={this._createArticleMarkup()}/>;
			break;
			case "/work":
				pageContent = <PageWork contentReady={this.props.content != null} content={this._createArticleMarkup()}/>;
			break;
			default:
				pageContent = <PageDefault contentReady={this.props.content != null} content={this._createArticleMarkup()}/>;
			break;
		}

		return (
			<div className={classNames.join(' ')}>
				<div className="page-content">
					{visibilityMarkerUp}

					{upCTA}
					
					<p>Tile #{this.props.tileIndex} : content of #{this.props.route}</p>

					{pageContent}

					{directLinkButton}

					{visibilityMarkerDown}
					
					{bottomCTA}
					
				</div>
			</div>
		);
	}
});

module.exports = RouteTile;