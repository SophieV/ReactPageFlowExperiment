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
			upCTA;

		if (this.props.firstTile && this.props.content != null && this.props.nextRouteUp != null) {
			upCTA = <h2> There is an up CTA on this page</h2>;
		}

		if (this.props.lastTile && this.props.content != null && this.props.nextRouteDown != null) {
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