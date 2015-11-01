var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var SocketActions = {

  updateCurrentWorld: function(item){
    AppDispatcher.handleServerAction({
      actionType: AppConstants.UPDATE_CURRENT_WORLD,
      data: item
    });
  }

};

module.exports = SocketActions;


