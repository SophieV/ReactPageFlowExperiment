import React from 'react'
import { Router, Route, Link } from 'react-router'

let NavigationItem = require('./NavigationItem.jsx')

let MainContainer = React.createClass({
	// _renderChildren: function () {
	//     return React.Children.map(this.props.children, function (child) {
	//         return React.addons.cloneWithProps(child, {
	//           jumpBackToContent: this._redirectJumpToContentCTA
	//         })
	//     }.bind(this))
	//   },//{this._renderChildren()}
	propTypes: {
		children: React.PropTypes.element
	},
	render: function() {
		return (<div className="main-container">
							<div className="navigation-bar">
								<p>
								  <NavigationItem currentRoute={this.props.location.pathname} routeValue="/home" routeLabel="Home"/>&nbsp;&nbsp;
						      <NavigationItem currentRoute={this.props.location.pathname} routeValue="/work" routeLabel="Work"/>
						    </p>
							</div>
							<div className="data-content">
								{this.props.children || "Welcome to the site"}
							</div>
						</div>
					);
	}
});

module.exports = MainContainer;
