var React = require('react');
var ReactDOM = require('react-dom');
var AppActions = require('../actions/AppActions.js');
var SocketActions = require('../actions/SocketActions.js');
var Masthead = require('./Masthead.js');
var ButtonPanel = require('./ButtonPanel.js');
var List = require('./List.js');
var AppStore = require('../stores/AppStore.js');
var SocketAPI = require('../lib/SocketAPI.js');
var AjaxAPI = require('../lib/AjaxAPI.js');

var Main = React.createClass({

  getInitialState: function(){
    SocketAPI.socketConnect();
    AjaxAPI.initialize();
    return {
      list: AppStore.getList(),
      currentWorld: AppStore.getCurrentWorld()
    }
  },
  componentDidMount: function(){
    AppStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function(){
    AppStore.removeChangeListener(this._onChange);
  },
  handleClickUp: function(){
    AppActions.clickUp();
  },
  handleClickDown: function(){
    AppActions.clickDown();
  },
  _onChange: function(){
    this.setState({
      list: AppStore.getList(),
      currentWorld: AppStore.getCurrentWorld()
    })
  },

  render: function(){

    var _this = this;
    return (
      <div className="app-container">
        <div className="css-root">

          <Masthead currentWorld={this.state.currentWorld} />

          <section className="css-scrollable-list">

            <List list={this.state.list}
                  currentWorld={this.state.currentWorld} />

            <ButtonPanel clickUp={this.handleClickUp} 
                         clickDown={this.handleClickDown}
                         list={this.state.list}
                         currentWorld={this.state.currentWorld} />

          </section>
        </div>      
      </div>
    )
  }
});

module.exports = Main;
