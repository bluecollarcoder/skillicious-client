var UserSessionApi = require('../apis/UserSessionApi');
var Promise = require('rsvp').Promise;
var _ = require('underscore');

var dispatcher;

module.exports = {
  "setUp":function(_dispatcher){
    dispatcher = _dispatcher;
  },
  "initialize":function(){
    dispatcher.dispatch({
      "actionType":"initialize"
    });
  },
  "signIn":function(email,password){
    return new Promise(function(resolve,reject){
      UserSessionApi.signIn(email,password).then(function(result){
        var action = _.extend({"actionType":"signin_success"},result);
        dispatcher.dispatch(action);
        resolve(result);
      }).catch(function(error){
        var action = _.extend({"actionType":"signin_failure"},error);
        dispatcher.dispatch(action);
        reject(error);
      });
    });
  },
  "signOut":function(token){
    return new Promise(function(resolve,reject){
      UserSessionApi.signOut(token).then(function(){
        dispatcher.dispatch({
          "actionType":"signout_success"
        });
        resolve();
      }).catch(function(error){
        reject(error);
      });
    });
  },
  "registerUser":function(name,email,password){
    debugger;
  },
  "registerEmployer":function(company,location,name,email,password){
    debugger;
  }
};
