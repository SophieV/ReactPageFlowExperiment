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
    content: contentStore.getContent(props.route)
  };
}

let Tile = React.createClass({
	getInitialState: function(){
		return getTileState(this.props);
	},
	componentDidMount: function() {
		contentStore.addChangeListener(this._onContentDataChanged);
	},
	componentWillUnmount: function(){
		contentStore.removeChangeListener(this._onContentDataChanged);
	},
	componentWillUpdate: function() {
	},
	componentDidUpdate: function() {
	},
	_onContentDataChanged: function() {
		// not triggered for first tile
		this.setState(getTileState(this.props));
	},
	_consoleLogTileInfo: function(message) {
		console.log('[' + this.props.tileIndex + ':' + this.props.route + '] ' + message);
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
			content = "Check More Content Over Here";
		}

		return {__html: content}; 
	},
	render: function() {
		let tileClassNames = ["content-tile"];

		if (!this.props.tileExpanded) {
			tileClassNames.push("collapsed");
		} else {
			tileClassNames.push("expanded");

			if (this.props.tileIndex === this.props.minTileIndex) {
				tileClassNames.push("first");
			} else if (this.props.routeDirectLink === this.props.route) {
				tileClassNames.push("jumped");
			}
		}

		tileClassNames.push("t-" + this.props.tileIndex);

		return (
			<div className={tileClassNames.join(' ')}>
				<div className="page-content">
					
					<p>Tile #{this.props.tileIndex} : content of #{this.props.route}</p>
					<div dangerouslySetInnerHTML={this._createArticleMarkup()}></div>
					
					
				</div>
			</div>
		);
	}
});

module.exports = Tile;