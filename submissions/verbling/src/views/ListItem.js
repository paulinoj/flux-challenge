var React = require('react');
var ReactDOM = require('react-dom');

var ListItem = React.createClass({

  render: function(){
	var listItemClass = 'css-slot ';

	if (this.props.homeworld === this.props.currentWorld) {
	  listItemClass = listItemClass + 'highlighted';
	}
    return (
	  <li className={listItemClass}>
	    <h3>{this.props.name}</h3>
	    <h6>{this.props.homeworld ? "Homeworld:  " + this.props.homeworld : ""}</h6>
	  </li>
    )
  }

});

module.exports = ListItem;