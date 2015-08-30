var UserProfileApi = require('../apis/UserProfileApi');
var Promise = require('rsvp').Promise;
var _ = require('underscore');

var dispatcher;

module.exports = {
  "setUp":function(_dispatcher){
    dispatcher = _dispatcher;
  },
  "initialize":function(){
    return new Promise(function(resolve,reject){
      UserProfileApi.getProfile().then(function(result){
        var action = {
          "actionType":"initialize",
          "profile":result
        };
        dispatcher.dispatch(action);
        resolve(result);
      }).catch(function(error){
        reject(error);
      });
    });
  },
  "updateProfile":function(profile){
    return new Promise(function(resolve,reject){
      var action = {
        "actionType":"update_success",
        "profile":profile
      };
      dispatcher.dispatch(action);
      resolve(profile);
    });
  }
};
