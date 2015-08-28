var RSVP = require('rsvp');

var API_ROOT = '/api';
var temp = 0;

module.exports = {
  "setUp":function(_root){
    API_ROOT = _root;
  },
  "signIn":function(email,password){
    return new RSVP.Promise(function(resolve,reject){
      window.setTimeout(function(){
        var results = {
          "principal":{"id":1,"name":"wayne"},
          "token":"ABCDEFGHI"
        };
        resolve(results);
      },2000);
    });
  },
  "signOut":function(token){
    return new RSVP.Promise(function(resolve,reject){
      window.setTimeout(function(){
        resolve();
      },2000);
    });
  }
};
