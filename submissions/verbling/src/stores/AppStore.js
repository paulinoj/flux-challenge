var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var ObjectAssign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;
var AjaxAPI = require('../lib/AjaxAPI');
var SocketAPI = require('../lib/SocketAPI');

var CHANGE_EVENT = 'change';
var listSize = 5;

// list: an array containing the 5 Siths to be displayed
// currentWorld:  a string containing the currentWorld being visited by Obi-Wan
// isFrozen: a boolean indicating whether the currentWorld is equal to one of
// the homeworlds of the Siths in our display list 

var _store = {
  list: [],
  currentWorld: '',
  isFrozen: false
};

// Initialize list with 5 empty slots

for (var i = 0; i < listSize; i++) {
  _store.list.push('');
}

// lookupTable is a hash table that contains the homeworlds of all the
// Siths currently in our array.  Used for fast lookup.

var lookupTable = {};

var updateFrozenState = function() {
  _store.isFrozen = lookupTable[_store.currentWorld]; 
};

// Clear 2 Siths from top of list and shift whole list up by 2, leaving 
// 2 empty items at bottom.  Remove homeworlds of deleted Siths from
// lookupTable beforehand.

var removeTwoMasters = function(array) {
  if (_store.list[0]) {
    lookupTable[_store.list[0].homeworld.name] = false;
  }
  if (_store.list[1]) {
    lookupTable[_store.list[1].homeworld.name] = false;
  }  
  var list = _store.list;
  list.shift();
  list.shift();
  list.push('');
  list.push('');
};

// Clear 2 Siths from bottom of list and shift whole list down by 2, 
// leaving 2 empty items at top.  Remove homeworlds of deleted Siths from
// lookupTable beforehand.

var removeTwoApprentices = function(array) {
  if (_store.list[3]) {
    lookupTable[_store.list[3].homeworld.name] = false;
  }
  if (_store.list[4]) {
    lookupTable[_store.list[4].homeworld.name] = false;
  }  
  var list = _store.list;
  list.pop();
  list.pop();
  list.unshift('');
  list.unshift('');
};

// requestMasters: Request n Siths from database that are on the master
// side of the Sith currently at the top of the list (because the 
// top n slots are empty when this function is called, the top Sith is the 
// one in index position n).  For each datum (Sith) requested by the 
// AjaxAPI, an action is dispatched that results in that item being placed 
// into the store individually using the store's addMaster function.

var requestMasters = function(n) {
  if (n !== 0) {
    var topMaster = _store.list[n];
    AjaxAPI.requestSiths(topMaster, 'master', n);
  }
};

// requestApprentices: This function operates in a manner similar to
// requestMasters above. 

var requestApprentices = function(n) {
  if (n !== 0) {
    var bottomApprentice = _store.list[4-n];
    AjaxAPI.requestSiths(bottomApprentice, 'apprentice', n);
  }
};

var abortAjaxRequests = function() {
  AjaxAPI.xhr.abort();
};

var addInitialSith = function(responseObject) {
  _store.list[0] = responseObject.Sith;
  lookupTable[responseObject.Sith.homeworld.name] = true;
  updateFrozenState();
  if (_store.isFrozen) {
    abortAjaxRequests();
  }  
};

// addMaster:  This places in the store each Sith requested by the AjaxAPI
// when requestMasters is called, with each Sith being
// processed by a separate action (so, for instance, if requestMasters
// requested 2 Siths, addMaster will end up being called 2 times).
// Each response object contains a property indicating the sequence order of
// that response, which is used to place the response at the proper array
// index of the store.  Responses are only added to the store if the
// UI is not in a frozen state, otherwise, they are discarded and requested
// again once the UI is unfrozen.  

var addMaster = function(responseObject) {
  if (!_store.isFrozen) {
    _store.list[responseObject.quantity - responseObject.orderNum] = responseObject.Sith;
    lookupTable[responseObject.Sith.homeworld.name] = true;
    updateFrozenState();
    if (_store.isFrozen) {
      abortAjaxRequests();
    }
  }
};

// addApprentice:  This function operates in a manner similar to addMaster
// above.

var addApprentice = function(responseObject) {
  if (!_store.isFrozen) {
    _store.list[4 - (responseObject.quantity - responseObject.orderNum)] = responseObject.Sith;
    lookupTable[responseObject.Sith.homeworld.name] = true;
    updateFrozenState();
    if (_store.isFrozen) {
      abortAjaxRequests();
    }    
  }
};

// updateCurrentWorld:  This sets the currentWorld using data received from the
// websocket.  It then checks the currentWorld against the homeworlds of the
// Siths currently in our list and determines whether the UI should be frozen.
// If it should be frozen, all outstanding ajax requests are cancelled.
// However, if it should not be frozen, then we need to determine if we
// have transitioned from a frozen state to an unfrozen state that has left 
// empty slots in the list.  If there are no outstanding ajax requests
// yet there are empty slots either at the top or bottom of the list, then
// we need to make new ajax requests to fill them up.

var updateCurrentWorld = function(data) {
  _store.currentWorld = data;
  updateFrozenState();
  if (_store.isFrozen) {
    abortAjaxRequests();
  }

  // Fill up empty slots that were left empty by previous frozen state

  if (!_store.isFrozen && (AjaxAPI.xhr.readyState === 0 || AjaxAPI.xhr.readyState === 4)) {

  // Determine if empty slots at top and if so, find top Sith and fill in masters upward

    var firstIndex = 0;
    while (_store.list[firstIndex] == '') {
      firstIndex++;
    }
    if (firstIndex !== 0 && firstIndex <= 4) {
      // Fill in from top
      requestMasters(firstIndex);
    }
    else

  // Otherwise, check to see if there are empty slots at bottom and if so, find
  // bottom Sith and fill in apprentices downward

    {
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
    AjaxAPI.initialize(3616);
    SocketAPI.socketConnect();
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

    case AppConstants.ADD_INITIAL_SITH:
      addInitialSith(action.data);
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