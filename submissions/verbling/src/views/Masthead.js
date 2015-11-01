var React = require('react');
var ReactDOM = require('react-dom');

var Masthead = React.createClass({

  render: function(){
    return (
	  <h1 className="css-planet-monitor">Obi-Wan currently on {this.props.currentWorld}</h1>
    )
  }

});

module.exports = Masthead;