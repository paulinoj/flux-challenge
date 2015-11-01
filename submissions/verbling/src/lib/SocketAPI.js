var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var SocketActions = require('../actions/SocketActions');

var connection; 

var SocketAPI = {
  socketConnect: function() {
    connection=new WebSocket('ws://localhost:4000','json');
    connection.onopen = function () {
      connection.send('Message'); 
    };
    connection.onerror = function (error) {
      console.log('Error Logged: ' + error); 
    };
    connection.onmessage = function (e) {
      console.log('Received From Server: ' + e.data); 
	    SocketActions.updateCurrentWorld(JSON.parse(e.data).name);
    };
  },

  disconnect: function() {
    connection.close();
  }
};

module.exports = SocketAPI;
