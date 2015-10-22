let
  React = require('react'),
  _ = require('underscore');

import { Router, Route, Link } from 'react-router'

var JumpButton = React.createClass({
  getInitialState: function(){
    return {
      jumpToContentIndex: _.random(this.props.rangeContentMin, this.props.rangeContentMax)
    }
  },
  handleClick: function(event) {
    this.props.jumpToContentCTARef(this.state.jumpToContentIndex);
  },
  render: function() {
    return (
      <p className="jump-to-btn" onClick={this.handleClick}>
        <Link to={"/" + this.state.jumpToContentIndex}>Jump to tile #C{this.state.jumpToContentIndex}</Link>
      </p>
    );
  }
});

module.exports = JumpButton;