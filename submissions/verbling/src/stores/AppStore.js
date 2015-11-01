var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var ObjectAssign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;
var AjaxAPI = require('../lib/AjaxAPI');

var CHANGE_EVENT = 'change';

var listSize = 5;

var _store = {
  list: [],
  currentWorld: "",
  upButtonActive: true,
  downButtonActive: true
};

for (var i = 0; i < listSize; i++) {
  _store.list.push("");
}

var initialize = function(array) {
  _store.list = array;
};

var removeTwoMasters = function(array) {
  var list = _store.list;
  list.shift();
  list.shift();
  list.push("");
  list.push("");
};

var removeTwoApprentices = function(array) {
  var list = _store.list;
  list.pop();
  list.pop();
  list.unshift("");
  list.unshift("");
};

var requestTwoMasters = function() {
  var topMaster = _store.list[2];
  AjaxAPI.requestTwoSiths(topMaster, "master");
}

var requestTwoApprentices = function() {
  var bottomApprentice = _store.list[2];
  AjaxAPI.requestTwoSiths(bottomApprentice, "apprentice");
}

var addMaster = function(array) {
  var length = array.length;
  _store.list[2 - length] = array[length - 1];
}

var addApprentice = function(array) {
  var length = array.length;
  _store.list[2 + length] = array[length - 1];
}

var updateCurrentWorld = function(data) {
  _store.currentWorld = data; 
};

var AppStore = ObjectAssign({}, EventEmitter.prototype, {
  addChangeListener: function(cb){
    this.on(CHANGE_EVENT, cb);
  },
  removeChangeListener: function(cb){
    this.removeListener(CHANGE_EVENT, cb);
  },
  getList: function(){
    return _store.list;      
  },
  getCurrentWorld: function(){
    console.log("CURRENTWORLD:  " + _store.currentWorld);
    return _store.currentWorld;      
  }  
});

AppDispatcher.register(function(payload){
  var action = payload.action;
  switch(action.actionType){
    case AppConstants.CLICK_DOWN:
      if (_store.list[4] !== "") {
        removeTwoMasters();
        AppStore.emit(CHANGE_EVENT);
        requestTwoApprentices();
        AppStore.emit(CHANGE_EVENT);
      }
      break;
    case AppConstants.CLICK_UP:
      if (_store.list[0] !== "") {
        removeTwoApprentices();
        AppStore.emit(CHANGE_EVENT);
        requestTwoMasters();
        AppStore.emit(CHANGE_EVENT);
      }
      break;
    case AppConstants.UPDATE_CURRENT_WORLD:
      console.log("update socket data");
      updateCurrentWorld(action.data);
      AppStore.emit(CHANGE_EVENT);
      break;
    case AppConstants.INITIALIZE:
      initialize(action.data);
      AppStore.emit(CHANGE_EVENT);
      break;
    case AppConstants.ADD_MASTER:
      addMaster(action.data);
      AppStore.emit(CHANGE_EVENT);
      break;
    case AppConstants.ADD_APPRENTICE:
      addApprentice(action.data);
      AppStore.emit(CHANGE_EVENT);
      break;
 
    default:
      return true;
  }
});

module.exports = AppStore;