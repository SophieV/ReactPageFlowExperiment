let
  React = require('react'),
  _ = require('underscore');

import { Router, Route, Link } from 'react-router'

var JumpButton = React.createClass({
  getInitialState: function(){
    return {
      randomValue: _.random(this.props.rangeMin, this.props.rangeMax)
    }
  },
  _handleClick: function(event) {
    this.props.goToRouteDirectlyRef("/" + this.state.randomValue);
  },
  render: function() {
    return (
      <p className="jump-to-btn" onClick={this._handleClick}>
        <Link to={"/" + this.state.randomValue}>Jump to tile #C{this.state.randomValue}</Link>
      </p>
    );
  }
});

module.exports = JumpButton;