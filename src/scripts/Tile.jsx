let
  React = require('react'),
  JumpButton = require('./JumpButton.jsx'),
  $ = require('jquery'),
  _ = require('underscore'),
  VisibilitySensor = require('react-visibility-sensor'),
  contentActions = require('./contentActions'),
  contentStore = require('./contentStore');

function getTileState(props) {
  return {
    content: contentStore.routeContent(props.route),
    contentRouteName: props.route
  };
}

let Tile = React.createClass({
	_consoleLogTileInfo: function(message) {
		console.log('[' + this.props.tileIndex + ':' + this.props.route + '] ' + message);
	},
	getInitialState: function(){
		return getTileState(this.props);
	},
	componentDidMount: function() {
		contentStore.addChangeListener(this._onContentDataChanged);
	},
	componentWillUnmount: function(){
		contentStore.removeChangeListener(this._onContentDataChanged);
	},
	componentDidUpdate: function(){
		if (this.props.route !== this.state.contentRouteName) {
			// the first tile may be "re-used" for another route
			this.setState({content: null, contentRouteName: null});
		}
	},
	_onContentDataChanged: function() {
		this.setState(getTileState(this.props));
	},
	_createArticleMarkup: function() { 
		let content;

		if (this.props.tileExpanded) {
			if (this.state.content != null) {
				content = this.state.content;
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
			upCTA;

		// if (this.state.content != null && this.props.nextRouteUp != null) {
		// 	upCTA = <h2> There is an up CTA on this page</h2>;
		// }

		if (this.state.content != null && this.props.nextRouteDown != null) {
			bottomCTA = <h2> There is a bottom CTA on this page</h2>;
		}

		return (
			<div className={classNames.join(' ')}>
				<div className="page-content">

					{upCTA}
					
					<p>Tile #{this.props.tileIndex} : content of #{this.props.route}</p>
					<div dangerouslySetInnerHTML={this._createArticleMarkup()}></div>
					
					{bottomCTA}
					
				</div>
			</div>
		);
	}
});

module.exports = Tile;