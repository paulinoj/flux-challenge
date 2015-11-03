var React = require('react');
var ReactDOM = require('react-dom');
var AppActions = require('../actions/AppActions');
var SocketActions = require('../actions/SocketActions');
var Masthead = require('./Masthead');
var ButtonPanel = require('./ButtonPanel');
var List = require('./List');
var AppStore = require('../stores/AppStore');

var Main = React.createClass({

  getInitialState: function(){
    AppStore.initialize();
    return {
      list: AppStore.getList(),
      currentWorld: AppStore.getCurrentWorld(),
      isFrozen: AppStore.isFrozen()
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
      currentWorld: AppStore.getCurrentWorld(),
      isFrozen: AppStore.isFrozen()      
    })

  },

  render: function(){
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
                         currentWorld={this.state.currentWorld}
                         isFrozen={this.state.isFrozen} />

          </section>
        </div>      
      </div>
    )
  }
});

module.exports = Main;
