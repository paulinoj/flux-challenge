var React = require('react');
var ReactDOM = require('react-dom');
var ListItem = require('./ListItem');

var List = React.createClass({
  render: function(){
  	var _this = this;
    return (
	    <ul className="css-slots">
	      {this.props.list.map(function(object, i) {

	        return <ListItem name={object ? object.name : ''} 
	                         homeworld={object ? object.homeworld.name : ''}
	                         currentWorld = {_this.props.currentWorld}
	                         key={i} />

	      })}
	    </ul>
    )
  }
});

module.exports = List;