var RSVP = require('rsvp');

var sessionStore;
var API_ROOT = '/api';
var temp = 0;

module.exports = {
  "setUp":function(_sessionStore,_root){
    sessionStore = _sessionStore;
    API_ROOT = _root ? _root : API_ROOT;
  },
  /**
   * Uses the email and password passed in to authenticate the user with the
   * server.
   * @param {string} email User's email.
   * @param {string} password User's password.
   * @returns {Promise} A promise object that resolves if the sign in attempt is
   *  successful.
   */
  "signIn":function(email,password){
    return new RSVP.Promise(function(resolve,reject){
      $.ajax(API_ROOT+'/auth',{
        "type":"GET",
        "headers":{
          "Authorization":"Basic " + new Buffer(email + ':' + password).toString('base64')
        },
        "success":function(principal,status,jqXHR){
          var results = {
            "principal":principal,
            "token":jqXHR.getResponseHeader('X-Jwt-Token')
          };
          resolve(results);
        },
        "error":function(jqXHR,status,error){
          reject(jqXHR.responseJSON);
        }
      });
    });
  },
  /**
   * Invalidates the JWT token on the server. For now, this function doesn't
   * actually do anything.
   * @param {string} token The JWT token to invalidate.
   * @returns {Promise} A promise object that always resolves.
   */
  "signOut":function(token){
    return new RSVP.Promise(function(resolve,reject){
      resolve();
    });
  },
  "registerUser":function(name,email,password){
    return new RSVP.Promise(function(resolve,reject){
      $.ajax(API_ROOT+'/auth',{
        "type":"POST",
        "contentType":"application/json",
        "processData":false,
        "data":JSON.stringify({
          "name":name,
          "email":email,
          "password":password,
          "role":"candidate"
        }),
        "success":function(principal,status,jqXHR){
          var results = {
            "principal":principal,
            "token":jqXHR.getResponseHeader('X-Jwt-Token')
          };
          resolve(results);
        },
        "error":function(jqXHR,status,error){
          reject(jqXHR.responseJSON);
        }
      });
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
