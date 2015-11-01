var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var AjaxActions = require('../actions/AjaxActions');

var xhr = new XMLHttpRequest();

var makeGetRequest = function(route) {
  xhr.open('GET', 'http://localhost:3000' + route, true);
  xhr.send();
  return xhr;
};

var AjaxAPI = {

  // requestsTwoSiths:  Makes two ajax requests in series where each request
  // retrieves a Sith from the database.  If the second argument is "master",
  // it retrieves the master and the grandmaster of the Sith whose ID is 
  // passed as the first argument.  If the second argument is "apprentice",
  // it retrieves the apprentice and grandapprentice instead.

  requestTwoSiths: function(Sith, relationship){
    var sithArray = [];
    var response;
    var id = relationship === 'master' ? Sith.master.id : 
             relationship === 'apprentice' ? Sith.apprentice.id : null;
    if (id) {
      var url = '/dark-jedis/' + id;
      var count = 2;

      // Abort previous request if it has not finished yet (this
      // only occurs when the user has clicked on the button opposite the
      // the one that triggered the previous request, because if he clicks on
      // the same button twice in a row and the requests triggered by
      // the first click have not yet finished, the second click is
      // short circuited by the AppDispatcher and ignored, so such a click
      // never invokes this AjaxAPI.requestTwoSiths function). 

      if (xhr.onreadystatechange !== 0 && xhr.onreadystatechange !== 4) {
        xhr.abort();
      }
      var asyncLoopWrapper = function(url, count) {
        xhr = makeGetRequest(url);
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4 && xhr.status === 200) {
            response = JSON.parse(xhr.responseText);
            sithArray.push(response);
            if (relationship === 'master') {
              AjaxActions.addMaster(sithArray);
            }
            else if (relationship === 'apprentice') {
              AjaxActions.addApprentice(sithArray);
            }
            count--;
            if (count > 0) {
              id = relationship === 'master' ? response.master.id : 
                   relationship === 'apprentice' ? response.apprentice.id : null;
              if (id) {
                url = '/dark-jedis/' + id;
                asyncLoopWrapper(url, count);
              }
            }
          }
        };
      };
      asyncLoopWrapper(url, 2);
    }
  },

  // initialize:  Makes 5 Ajax requests for apprentices starting with 
  // Sith ID 3616.  The asyncLoopWrapper makes sure the responses arrive
  // in the same order the calls were made.  The response of each request
  // is pushed into an array which is then sent as the payload of
  // an action that updates the AppStore list by replacing it entirely
  // with the payload.

  initialize: function() {
    var url = '/dark-jedis/3616';
    var counter = 0;
    var maxSize = 5;
    var response;
    var answerArray = ['', '', '', '', ''];
    var id;
    var asyncLoopWrapper = function(url) {
      xhr = makeGetRequest(url);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
          response = JSON.parse(xhr.responseText);
          answerArray[counter] = response;
          AjaxActions.initialize(answerArray);         
          counter++;
          if (counter < maxSize) {
            id = response.apprentice.id;
            if (id) {
              url = '/dark-jedis/' + id;
              asyncLoopWrapper(url);
            }
          }
        }
      };
    };
    asyncLoopWrapper(url);
  }
};

module.exports = AjaxAPI;

