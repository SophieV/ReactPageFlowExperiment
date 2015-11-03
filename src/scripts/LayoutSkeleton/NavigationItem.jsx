let
  React = require('react'),
  _ = require('underscore');

import { Router, Route, Link } from 'react-router'

var NavigationItem = React.createClass({
  propTypes: {
    routeValue: React.PropTypes.string.isRequired,
    routeLabel: React.PropTypes.string.isRequired,
    currentRoute: React.PropTypes.string.isRequired
  },
  render: function() {
    let isActiveItem = this.props.currentRoute === this.props.routeValue;
    let classNames = (isActiveItem?'active-route':'');

    return (<span className={classNames}>
              <Link to={this.props.routeValue}>{this.props.routeLabel}</Link>
            </span>
        );
  }
});

module.exports = NavigationItem;
