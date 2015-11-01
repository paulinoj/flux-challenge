var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var AjaxActions = require('../actions/AjaxActions');

var xhr = new XMLHttpRequest();

var makeGetRequest = function(route) {
  xhr.open("GET", "http://localhost:3000" + route, true);
  xhr.send();
  return xhr;
};

var AjaxAPI = {

  requestTwoSiths: function(Sith, relationship){
    var answer = [];
    var response;
    var id = relationship === "master" ? Sith.master.id : 
             relationship === "apprentice" ? Sith.apprentice.id : null;

    if (id) {

      var url = "/dark-jedis/" + id;

      var count = 2;
      if (xhr.onreadystatechange !== 0 && xhr.onreadystatechange !== 4) {
        xhr.abort();
      }

      var asyncLoopWrapper = function(url, count) {
        xhr = makeGetRequest(url);
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4 && xhr.status === 200) {
            response = JSON.parse(xhr.responseText);
            answer.push(response);
            if (relationship === "master") {
              AjaxActions.addMaster(answer);
            }
            else if (relationship === "apprentice") {
              AjaxActions.addApprentice(answer);
            }
            count--;
            if (count > 0) {
              id = relationship === "master" ? response.master.id : 
                   relationship === "apprentice" ? response.apprentice.id : null;
              if (id) {
                url = "/dark-jedis/" + id;
                asyncLoopWrapper(url, count);
              }
            }
          }
        };
      };
      asyncLoopWrapper(url, 2);
    }
  },

  initialize: function() {
    var url = "/dark-jedis/3616"
    var counter = 0;
    var maxSize = 5;
    var response;
    var answerArray = ["", "", "", "", ""];
    var id;
    var asyncLoopWrapper = function(url) {
      xhr = makeGetRequest(url);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
          response = JSON.parse(xhr.responseText);
          console.log(response);
          answerArray[counter] = response;
          AjaxActions.initialize(answerArray);         
          counter++;
          if (counter < maxSize) {
            id = response.apprentice.id;
            if (id) {
              url = "/dark-jedis/" + id;
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

