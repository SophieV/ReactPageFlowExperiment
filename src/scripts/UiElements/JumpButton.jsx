let
  React = require('react'),
  _ = require('underscore');

import { Router, Route, Link } from 'react-router'

var JumpButton = React.createClass({
  propTypes: {
    rangeMin: React.PropTypes.number.isRequired,
    rangeMax: React.PropTypes.number.isRequired,
    handleGoToRouteDirectlyClick: React.PropTypes.func.isRequired
  },
  getInitialState: function(){
    return {
      randomValue: _.random(this.props.rangeMin, this.props.rangeMax)
    }
  },
  _handleClick: function(event) {
    this.props.handleGoToRouteDirectlyClick("/" + this.state.randomValue);
  },
  render: function() {
    // do not use a Link because it will update the route in the browser before the click is handled
    // in other words, no chance to set a flag to ignore the route change
    return (<a className="jump-to-btn" onClick={this._handleClick}>
              Jump to tile #C{this.state.randomValue}
            </a>
          );
  }
});

module.exports = JumpButton;