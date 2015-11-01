var React = require('react');
var ReactDOM = require('react-dom');

var ButtonPanel = React.createClass({
  render: function(){
    var list = this.props.list;
    var firstIndex = 0;
    var lastIndex = 4;
    var downButtonActive = true;
    var upButtonActive = true;
    var downButtonClass = "css-button-down";
    var upButtonClass = "css-button-up";

    var disableUpButton = function() {
      upButtonActive = false;
      upButtonClass = "css-button-up css-button-disabled";      
    }

    var disableDownButton = function() {
      downButtonActive = false;
      downButtonClass = "css-button-down css-button-disabled";      
    }

    // Disable buttons during initial load
    // Initial load is occurring when 3 bottom list items are empty.

    if (list[2] === "" && list[3] === "" && list[4] === "") {
      disableUpButton();
      disableDownButton();
    }

    // Get first index 
    while (list[firstIndex] == "") {
      firstIndex++;
    }

    while (list[lastIndex] == "") {
      lastIndex--;
    }

    for (var i = 0; i < this.props.list.length; i++) {
      if (this.props.list[i] !== "" && this.props.list[i].homeworld.name === this.props.currentWorld) {
        disableUpButton();
        disableDownButton();
      }
    }

    if (!list[lastIndex] || list[lastIndex].apprentice.id == null) {
      disableDownButton();
    }   

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