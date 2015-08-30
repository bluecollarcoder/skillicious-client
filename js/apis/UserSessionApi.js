var RSVP = require('rsvp');

var sessionStore;
var API_ROOT = '/api';
var temp = 0;

module.exports = {
  "setUp":function(_sessionStore,_root){
    sessionStore = _sessionStore;
    API_ROOT = _root;
  },
  "signIn":function(email,password){
    return new RSVP.Promise(function(resolve,reject){
      window.setTimeout(function(){
        var results = {
          "principal":{
            "id":1,
            "email":"waynebeast@gmail.com",
            "name":"Wayne Beast",
            "role":"candidate"
          },
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
  },
  "registerUser":function(name,email,password){
    return new RSVP.Promise(function(resolve,reject){
      window.setTimeout(function(){
        var results = {
          "principal":{
            "id":1,
            "email":"waynebeast@gmail.com",
            "name":"Wayne Beast",
            "role":"candidate"
          },
          "token":"ABCDEFGHI"
        };
        resolve(results);
      },2000);
    });
  },
  "registerEmployer":function(company,location,name,email,password){
    return new RSVP.Promise(function(resolve,reject){
      window.setTimeout(function(){
        var results = {
          "principal":{
            "id":2,
            "email":"wayne@skillicio.us",
            "name":"Wayne Chan",
            "role":"recruiter",
            "company":{
              "name":"Skillicious",
              "location":"New York, NY"
            }
          },
          "token":"ABCDEFGHI"
        };
        resolve(results);
      },2000);
    });
  }
};
