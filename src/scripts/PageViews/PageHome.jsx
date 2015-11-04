let
  React = require('react'),
  _ = require('underscore');

import { Router, Route, Link } from 'react-router'

var PageHome = React.createClass({
  propTypes: {
    contentReady: React.PropTypes.bool.isRequired,
    content: React.PropTypes.object.isRequired
  },
  render: function() {
  	let contentArea;

  	if (this.props.contentReady) {
  		// enclosing div here required by build
  		contentArea = (<div>
  							<h1>I am a PageHome component</h1>
	      					<h2>I display my page content the way I want...</h2>
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

module.exports = PageHome;
