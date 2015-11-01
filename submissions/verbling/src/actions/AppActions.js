var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var AppActions = {

  clickUp: function(){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.CLICK_UP,
      data: null
    });
  },

  clickDown: function(){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.CLICK_DOWN,
      data: null
    })
  }

};

module.exports = AppActions;