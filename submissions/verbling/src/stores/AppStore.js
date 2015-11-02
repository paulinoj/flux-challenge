var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var ObjectAssign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;
var AjaxAPI = require('../lib/AjaxAPI');
var SocketAPI = require('../lib/SocketAPI.js');

var CHANGE_EVENT = 'change';
var listSize = 5;

var _store = {
  list: [],
  currentWorld: '',
  isFrozen: false
};

// Initialize list with 5 empty slots

for (var i = 0; i < listSize; i++) {
  _store.list.push('');
}

// initialize:  This function completes the action dispatched by the 
// AjaxAPI when it is making the initial request from the database
// at startup.  It takes the payload from that action and replaces
// _store.list entirely.

var initialize = function(array) {
  _store.list = array;
};

var updateFrozenState = function() {
  var isFrozen = false;
  for (var i=0; i < _store.list.length; i++) {
    if (_store.list[i] !== "" && _store.list[i].homeworld.name === _store.currentWorld) {
      isFrozen = true;
    }
  }
  _store.isFrozen = isFrozen; 
};

// Clear two items from top of list and shift whole list up 2 items, leaving 
// two empty items at bottom

var removeTwoMasters = function(array) {
  var list = _store.list;
  list.shift();
  list.shift();
  list.push('');
  list.push('');
};

// Clear two items from bottom of list and shift whole list down 2 items, 
// leaving two empty items at top

var removeTwoApprentices = function(array) {
  var list = _store.list;
  list.pop();
  list.pop();
  list.unshift('');
  list.unshift('');
};

// requestTwoMasters: Requests two Siths from database that are the master and
// grandmaster of the Sith currently at the top of the list (because the 
// top two slots are empty when this function is called, the top Sith is the 
// one in index position 2).  For each datum (Sith) requested by the 
// AjaxAPI, an action is dispatched that results in that item being placed 
// into the store individually using the store's addMaster function.

var requestMasters = function(quantity) {
  if (quantity !== 0) {
    var topMaster = _store.list[quantity];
    console.log("MASTER");
    AjaxAPI.requestSiths(topMaster, 'master', quantity);
  }
}

// requestTwoApprentices: This function operates in a manner similar to
// requestTwoMasters above. 

var requestApprentices = function(quantity) {
  if (quantity !== 0) {
    var bottomApprentice = _store.list[4-quantity];
    AjaxAPI.requestSiths(bottomApprentice, 'apprentice', quantity);
  }
}

// addMaster:  This places in the store each Sith requested by the AjaxAPI
// when requestTwoMasters is called, with each Sith being
// processed by a separate action.  The first action carries an array 
// payload of length 1 and contains the master.  The second action carries
// an array payload of length 2 and contains both the master and the 
// grandmaster.  Because the second array sent is longer than the first, 
// addMaster is able to determine which payload was sent later and
// uses that information to place the data in the appropriate index of the
// store, filling the two empty slots starting from the second one upward

var addMaster = function(responseObject) {
  if (!_store.isFrozen) {
    console.log("THIS:  ");
    console.log(responseObject.quantity - responseObject.orderNum);
    _store.list[responseObject.quantity - responseObject.orderNum] = responseObject.Sith;
    updateFrozenState();
  }
}

// addApprentice:  This function operates in a manner similar to addMaster
// above.

var addApprentice = function(responseObject) {
  if (!_store.isFrozen) {
    _store.list[4 - (responseObject.quantity - responseObject.orderNum)] = responseObject.Sith;
    updateFrozenState();
  }
}

var updateCurrentWorld = function(data) {
  _store.currentWorld = data;
  updateFrozenState();
  // Continue filling empty spaces that are waiting
  if (!_store.isFrozen && (AjaxAPI.xhr.readystate === 0 || AjaxAPI.xhr.readystate === 4)) {
    var firstIndex = 0;
    while (_store.list[firstIndex] == '') {
      firstIndex++;
    }
    if (firstIndex !== 0 && firstIndex <= 4) {
      // Fill in from top
      console.log("DO WE GET HERE 1");
      requestMasters(firstIndex);
    }
    else
    {
      // Get index of last Sith in list
      var lastIndex = 4;
      while (_store.list[lastIndex] == '') {
        lastIndex--;
      }
      if (lastIndex !== 4 && lastIndex >= 0) {
        requestApprentices(4-lastIndex);
      }
    }
  }
};

var AppStore = ObjectAssign({}, EventEmitter.prototype, {
  addChangeListener: function(cb) {
    this.on(CHANGE_EVENT, cb);
  },
  removeChangeListener: function(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  },
  initialize: function() {
    SocketAPI.socketConnect();
    AjaxAPI.initialize();
  },
  getList: function() {
    return _store.list;      
  },
  getCurrentWorld: function() {
    return _store.currentWorld;      
  },
  isFrozen: function() {
    return _store.isFrozen;
  }
});

AppDispatcher.register(function(payload) {
  var action = payload.action;
  switch (action.actionType) {

    case AppConstants.CLICK_DOWN:

      // The inequality check here verifies that any previous
      // CLICK_DOWN action has finished and the stores are finished
      // being updated with data from the prevous request.  (If the
      // bottom item of the list is empty at this point, that means the
      // user had triggered a CLICK_DOWN action immediately prior to
      // the current one and that it has not finished receiving its
      // AJAX responses, so we should ignore the current one.)

      if (_store.list[4] !== '') {
        removeTwoMasters();
        AppStore.emit(CHANGE_EVENT);
        requestApprentices(2);
        AppStore.emit(CHANGE_EVENT);
      }
      break;

    case AppConstants.CLICK_UP:

      // The inequality check here serves a similar purpose to the
      // one immediately above

      if (_store.list[0] !== '') {
        removeTwoApprentices();
        AppStore.emit(CHANGE_EVENT);
        requestMasters(2);
        AppStore.emit(CHANGE_EVENT);
      }
      break;

    case AppConstants.UPDATE_CURRENT_WORLD:
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