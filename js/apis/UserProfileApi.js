var RSVP = require('rsvp');

var sessionStore;
var API_ROOT = '/api';

module.exports = {
  "setUp":function(_sessionStore,_root){
    sessionStore = _sessionStore;
    API_ROOT = _root ? _root : API_ROOT;
  },
  "ajax":function(){
    var options;
    if (arguments[1]) {
      options = arguments[1];
      options.url = arguments[0];
    } else
      options = arguments[0];
    // Set the authorization header
    if (!options.headers)
      options.headers = {};
    options.headers.Authorization = "JWT " + sessionStore.token;
    // Replace error handler with custom handler
    if (options.error) {
      var original = options.error;
      options.error = function(jqXHR,status,error){
        if (jqXHR.status == 401)
          sessionStore.emit("expire",{"actionType":"expire"});
        else
          original.call(this,jqXHR,status,error);
      };
    }
    // Call jQuery ajax
    $.ajax(options);
  },
  "getProfile":function(userId){
    var self = this;
    return new RSVP.Promise(function(resolve,reject){
      self.ajax(API_ROOT+'/profiles',{
        "type":"GET",
        "success":function(profile,status,jqXHR){
          resolve(profile);
        },
        "error":function(jqXHR,status,error){
          reject(new Error(error));
        }
      });
    });
  },
  "updateProfile":function(profile){
    var self = this;
    return new RSVP.Promise(function(resolve,reject){
      self.ajax(API_ROOT+'/profiles',{
        "type":"PUT",
        "contentType":"application/json",
        "processData":false,
        "data":JSON.stringify(profile),
        "success":function(updated){
          resolve(updated);
        },
        "error":function(jqXHR,status,error){
          reject(new Error(error));
        }
      });
    });
  }
};
