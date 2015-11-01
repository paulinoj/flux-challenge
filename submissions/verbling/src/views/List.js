var React = require('react');
var ReactDOM = require('react-dom');
var ListItem = require('./ListItem');

var List = React.createClass({

  render: function(){
    return (
	    <ul className="css-slots">
	      {this.props.list.map(function(object, i) {

	        return <ListItem name={object ? object.name : ''} 
	                         homeworld={object ? object.homeworld.name : ''}
	                         currentWorld={this.props.currentWorld}
	                         key={i} />

	      }, this)}
	    </ul>
    )
  }

});

module.exports = List;