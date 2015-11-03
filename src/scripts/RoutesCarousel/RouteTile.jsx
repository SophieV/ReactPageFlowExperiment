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
  propsType: {
    tileIndex: React.PropTypes.number.isRequired,
    isNewPageReset: React.PropTypes.boolean,
    route: React.PropTypes.string.isRequired,
    content: React.PropTypes.string.isRequired,
    isExpanded: React.PropTypes.bool.isRequired,
    isFirstTile: React.PropTypes.bool.isRequired,
    isLastTile: React.PropTypes.bool.isRequired,
    isAccessedDirectly: React.PropTypes.bool.isRequired,
    isScrolledTo: React.PropTypes.bool.isRequired,
    nextRouteUp: React.PropTypes.string.isRequired,
    nextRouteDown: React.PropTypes.string.isRequired,
    lastRouteTriggeredPending: React.PropTypes.string.isRequired,
    handleGoToRouteDirectlyClick: React.PropTypes.func.isRequired,
    handleTileVisibilityChange: React.PropTypes.func.isRequired,
    positionRestore: React.PropTypes.number,
    isVisible: React.PropTypes.bool,
    lastRouteScrolledBack: React.PropTypes.string
  },
  getDefaultProps: function() {
    return {
      positionRestore: 0,
      isVisible: false,
      lastRouteScrolledBack: null
    };
  },
	componentDidMount: function() {
		this._toggleVisibilitySensor(false);
	},
	componentWillUpdate: function() {
		this.props.positionRestore = this.getDOMNode().offsetTop;
		this._toggleVisibilitySensor(false);
	},
	componentDidUpdate: function() {
		this._consoleLogTileInfo("i received still ongoing action : " + this.props.lastRouteTriggeredPending);
		this._toggleVisibilitySensor(!this.props.lastRouteTriggeredPending);

		if (this.props.isScrolledTo && (this.props.lastRouteScrolledBack !== this.props.route || this.props.isNewPageReset)) {
			// the scrolling should happen once, not every time some value of the state received has changed
			$(window).scrollTop(this.props.positionRestore);
			this._consoleLogTileInfo('scrolled window to me');
			this.props.positionRestore = 0;
			this.props.lastRouteScrolledBack = this.props.route;
		}
	},
  _consoleLogTileInfo: function(message) {
    console.log('[' + this.props.tileIndex + ':' + this.props.route + '] ' + message);
  },
	_toggleVisibilitySensor: function(active) {
		VisibilitySensor.active = active;
		this._consoleLogTileInfo("visibility sensor is active : " + VisibilitySensor.active);
	},
	_handleMarkerVisibilityChange: function(isVisible) {
		if (!this.props.lastRouteTriggeredPending && isVisible !== this.props.isVisible) {
			this.props.isVisible = isVisible;

			if (isVisible) {
				this._consoleLogTileInfo('one of the markers now ' + (isVisible ? 'visible' : 'hidden'));
				this.props.handleTileVisibilityChange(this.props.route);
			}
		}
	},
	_createPageMarkup: function() {
		let htmlMarkup;

		if (this.props.isExpanded) {
			if (this.props.content != null) {
				htmlMarkup = this.props.content;
			} else {
				htmlMarkup = "Loading...";
			}
		} else {
			htmlMarkup = "More Content Coming Here";
		}

		return {__html: htmlMarkup};
	},
	render: function() {
		let classNames = ["content-tile"];

		if (this.props.isExpanded) {
			classNames.push("expanded");
		} else {
			classNames.push("collapsed");
		}

		if (this.props.isFirstTile) {
			classNames.push("first");
		}

		if (this.props.isLastTile) {
			classNames.push("last");
		}

		if (this.props.isAccessedDirectly) {
			classNames.push("jumped");
		}

		classNames.push("t-" + this.props.tileIndex);

		let pageContent,
  			showNextRouteIncentiveDown,
  			showNextRouteIncentiveUp,
  			directLinkButton,
  			visibilityMarkerUp,
  			visibilityMarkerDown;

		if (this.props.isFirstTile && this.props.content != null && this.props.nextRouteUp != null) {
			showNextRouteIncentiveUp = <h2> There is an up CTA to {this.props.nextRouteUp}</h2>;
		}

		if (this.props.isLastTile && this.props.content != null && this.props.nextRouteDown != null) {
			showNextRouteIncentiveDown = <h2> There is a bottom CTA to {this.props.nextRouteDown}</h2>;
		}

		if (this.props.content != null) {
			visibilityMarkerUp = (<div className="visibility-sensor-up">Visibility Sensor for #T{this.props.tileIndex} #C{this.props.route}
						<VisibilitySensor onChange={this._handleMarkerVisibilityChange} />
					</div>);

			visibilityMarkerDown = (<div className="visibility-sensor-down">Visibility Sensor for #T{this.props.tileIndex} #C{this.props.route}
						<VisibilitySensor onChange={this._handleMarkerVisibilityChange} />
					</div>);

			directLinkButton = (<JumpButton rangeMin={-100} rangeMax={100} handleGoToRouteDirectlyClick={this.props.handleGoToRouteDirectlyClick}/>);
		}

		switch(this.props.route) {
			case "/home":
				pageContent = <PageHome contentReady={this.props.content != null} content={this._createPageMarkup()}/>;
			break;
			case "/work":
				pageContent = <PageWork contentReady={this.props.content != null} content={this._createPageMarkup()}/>;
			break;
			default:
				pageContent = <PageDefault contentReady={this.props.content != null} content={this._createPageMarkup()}/>;
			break;
		}

		return (<div className={classNames.join(' ')}>
      				<div className="page-content">
      					{visibilityMarkerUp}
      					{showNextRouteIncentiveUp}
      					<p>Tile #{this.props.tileIndex} : content of #{this.props.route}</p>
      					{pageContent}
      					{directLinkButton}
      					{visibilityMarkerDown}
      					{showNextRouteIncentiveDown}
      				</div>
      			</div>
      		);
	}
});

module.exports = RouteTile;
