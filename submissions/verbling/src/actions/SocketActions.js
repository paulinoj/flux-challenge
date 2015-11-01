var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var SocketActions = {

  updateCurrentWorld: function(currentWorld){
    AppDispatcher.handleServerAction({
      actionType: AppConstants.UPDATE_CURRENT_WORLD,
      data: currentWorld
    });
  }

};

module.exports = SocketActions;


