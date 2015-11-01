var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var AjaxActions = {

  initialize: function(array){
    AppDispatcher.handleServerAction({
      actionType: AppConstants.INITIALIZE,
      data: array
    });
  },

  addMaster: function(master){
    AppDispatcher.handleServerAction({
      actionType: AppConstants.ADD_MASTER,
      data: master
    });
  },

  addApprentice: function(apprentice){
    AppDispatcher.handleServerAction({
      actionType: AppConstants.ADD_APPRENTICE,
      data: apprentice
    });
  },

};

module.exports = AjaxActions;


