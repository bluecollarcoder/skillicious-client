var CandidateApi = require('../apis/CandidateApi');
var Promise = require('rsvp').Promise;

var dispatcher;

module.exports = {
  "setUp":function(_dispatcher){
    dispatcher = _dispatcher;
  },
  "initialize":function(candidates){
    var action = {
      "actionType":"initialize"
    };
    if (candidates) {
      action.candidates = candidates;
      dispatcher.dispatch(action);
    } else {
      dispatcher.dispatch(action);
      return new Promise(function(resolve,reject){
        CandidateApi.getAllCandidates().then(function(results){
          dispatcher.dispatch({
            "actionType":"refresh",
            "candidates":results
          });
          resolve();
        }).catch(function(error){
          reject(error);
        });
      });
    }
  },
  "filter":function(filterTerms){
    dispatcher.dispatch({
      "actionType":"filter",
      "filterTerms":filterTerms
    });
  },
  "refresh":function(){
    return new Promise(function(resolve,reject){
      CandidateApi.getAllCandidates().then(function(results){
        dispatcher.dispatch({
          "actionType":"refresh",
          "candidates":results
        });
        resolve();
      }).catch(function(error){
        reject(error);
      });
    });
  }
};
