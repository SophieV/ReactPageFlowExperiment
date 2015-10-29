let
  React = require('react'),
  _ = require('underscore');

import { Router, Route, Link } from 'react-router'

var PageWork = React.createClass({
  render: function() {
  	let contentArea;

  	if (this.props.contentReady) {
  		// enclosing div here required by build
  		contentArea = (<div>
  						<h1>I am a PageWork component</h1>
	      				<hr/>
	      				<div className="yellow-box" dangerouslySetInnerHTML={this.props.content}></div>
	      			   </div>);
  	} else {
  		contentArea = (<div dangerouslySetInnerHTML={this.props.content}></div>);
  	}

    return (
    	<div className="page-data">
	      {contentArea}
	    </div>
    );
  }
});

module.exports = PageWork;