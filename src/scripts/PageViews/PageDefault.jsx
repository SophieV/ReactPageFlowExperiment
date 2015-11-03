let
  React = require('react'),
  _ = require('underscore');

import { Router, Route, Link } from 'react-router'

var PageDefault = React.createClass({
  propTypes: {
    contentReady: React.PropTypes.bool.isRequired,
    content: React.PropTypes.string.isRequired
  },
  render: function() {
  	let contentArea;

  	if (this.props.contentReady) {
  		// enclosing div here required by build
  		contentArea = (<div>
  						<h1>I am a simple PageDefault component, nothing fancy</h1>
	      			   	<div dangerouslySetInnerHTML={this.props.content}></div>
	      			   </div>);
  	} else {
  		contentArea = (<div dangerouslySetInnerHTML={this.props.content}></div>);
  	}

    return (<div className="page-data">
      	      {contentArea}
      	    </div>
          );
  }
});

module.exports = PageDefault;
