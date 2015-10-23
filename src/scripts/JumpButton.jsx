let
  React = require('react'),
  _ = require('underscore');

import { Router, Route, Link } from 'react-router'

var JumpButton = React.createClass({
  getInitialState: function(){
    return {
      jumpToContentRoute: _.random(this.props.rangeContentRouteMin, this.props.rangeContentRouteMax)
    }
  },
  _handleClick: function(event) {
    this.props.jumpToRouteRef(this.state.jumpToContentRoute);
  },
  render: function() {
    return (
      <p className="jump-to-btn" onClick={this._handleClick}>
        <Link to={"/" + this.state.jumpToContentRoute}>Jump to tile #C{this.state.jumpToContentRoute}</Link>
      </p>
    );
  }
});

module.exports = JumpButton;