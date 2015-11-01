var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var AppActions = {

  clickUp: function(item){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.CLICK_UP,
      data: item
    });
  },

  clickDown: function(item){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.CLICK_DOWN,
      data: item
    })
  }

};

module.exports = AppActions;