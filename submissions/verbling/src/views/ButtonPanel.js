var React = require('react');
var ReactDOM = require('react-dom');

var ButtonPanel = React.createClass({

  render: function(){
    var list = this.props.list;
    var firstIndex = 0;
    var lastIndex = 4;
    var downButtonActive = true;
    var upButtonActive = true;
    var downButtonClass = 'css-button-down';
    var upButtonClass = 'css-button-up';

    var disableUpButton = function() {
      upButtonActive = false;
      upButtonClass = 'css-button-up css-button-disabled';      
    }

    var disableDownButton = function() {
      downButtonActive = false;
      downButtonClass = 'css-button-down css-button-disabled';      
    }

    // Disable buttons during initial load.
    // Initial load is in process when 3 bottom list items are empty.

    if (list[2] === '' && list[3] === '' && list[4] === '') {
      disableUpButton();
      disableDownButton();
    }

    // Get index of first Sith in list -- this anticipates the theoretical
    // situation where the user has clicked on the up button and vacated
    // two spaces at the top of the list but there is only one Sith master
    // left in the database to fill them, so the first row is left empty

    while (list[firstIndex] == '') {
      firstIndex++;
    }

    // Get index of last Sith in list

    while (list[lastIndex] == '') {
      lastIndex--;
    }

    // Disable buttons if the currentWorld is the homeworld of any Siths
    // currently on the list

    for (var i = 0; i < this.props.list.length; i++) {
      if (this.props.list[i] !== '' && this.props.list[i].homeworld.name === this.props.currentWorld) {
        disableUpButton();
        disableDownButton();
      }
    }

    // If there are no items in the list at all (so list[lastIndex] is undefined)
    // or bottom Sith has no apprentice, disable downbutton

    if (!list[lastIndex] || list[lastIndex].apprentice.id == null) {
      disableDownButton();
    }   

    // If there are no items in the list at all (so list[firstIndex] is undefined)
    // or top Sith has no master, disable upbutton

    if (!list[firstIndex] || list[firstIndex].master.id == null) {
      disableUpButton();
    }   

    return (
      <div className="css-scroll-buttons">
        <button onClick={this.props.clickUp} 
                disabled={!upButtonActive}
                className={upButtonClass}></button>
        <button onClick={this.props.clickDown}
                disabled={!downButtonActive}
                className={downButtonClass}></button>
      </div>
    )
  }
});

module.exports = ButtonPanel;