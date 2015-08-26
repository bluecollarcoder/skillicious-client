var RSVP = require('rsvp');

var API_ROOT = '/api';
var temp = 0;

module.exports = {
  "setUp":function(_root){
    API_ROOT = _root;
  },
  "getAllCandidates":function(){
    return new RSVP.Promise(function(resolve,reject){
      window.setTimeout(function(){
        var results = [
          new Candidate({
            "name":"John Wayne",
            "skills":{
              "Java":2,
              "SQL":3
            }
          }),
          new Candidate({
            "name":"Marlon Brando",
            "skills":{
              "NodeJS":1,
              "MongoDB":1,
              "Javascript":2
            }
          })
        ];
        if (temp++%2 == 1)
          results.push(new Candidate({
            "name":"Full-stack Joe",
            "skills":{
              "NodeJS":2,
              "MongoDB":2,
              "Javascript":2,
              "Java":2,
              "SQL":2
            }
          }));
        resolve(results);
      },2000);
    });
  }
};
