var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var AjaxActions = {

  addInitialSith: function(sith){
    AppDispatcher.handleServerAction({
      actionType: AppConstants.ADD_INITIAL_SITH,
      data: sith
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


