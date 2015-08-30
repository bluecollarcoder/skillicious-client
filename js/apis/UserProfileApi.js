var RSVP = require('rsvp');

var sessionStore;
var API_ROOT = '/api';
var temp = 0;

module.exports = {
  "setUp":function(_sessionStore,_root){
    sessionStore = _sessionStore;
    API_ROOT = _root;
  },
  "getProfile":function(){
    return new RSVP.Promise(function(resolve,reject){
      window.setTimeout(function(){
        var results = {
          "summary":"I believe in technology's power to transform people's lives. My goal is to use technologies to build products and solutions that improve people's lives, and in the process build a sustainable business. The problems that I am particularly interested in are: health/fitness/nutrition, education, food, and sustainable use of our environment. I have extensive experience in building web-based application and API that run on the cloud. I am comfortable working with:\n* SQL and noSQL databases\n* Java and JVM\n* Node.js\n* React.js, jQuery and other client-side JS libraries\n* Provisioning and managing AWS infrastructure",
          "skills":{
            "Javascript":2,
            "Java":2,
            "NodeJS":1,
            "SQL":2
          },
          "work":[
            {
              "employer":"Fitness Tech Startup",
              "title":"Evangelist",
              "start":"2015-06",
              "end":"2015-08",
              "desc":"73% of people who set fitness and diet goals fail to achieve them. Personal fitness training has been shown to be effective in causing sustained, positive behavior change. But it is a luxury too few can afford.\n\nThe project's goal is to create a tool that allows trainers to combine the benefits of in-person and remote fitness training, thereby making their service more interactive, cheaper and more accessible. As part of the founding team, I helped:\n* Refine the business plan and pitch it to potential customers and investors \n* Validate the opportunity by conducting customer interviews\n* Recruit partners and supporters by effectively communicating the product vision\n* Refine product design through iterative prototyping process"
            },
            {
              "employer":"Veoci.com",
              "title":"Senior Engineer",
              "start":"2011-02",
              "end":"2015-05",
              "desc":"Our goal at Veoci is to revolutionize the way governments and organizations respond to emergencies. Veoci is a cloud-based BPM and real-time communication platform designed for emergency managers and responders. Our product gives them the ability to take the right actions at the right time to resolve the crisis faster.\n\nDuring my time at Veoci, my contribution included: \n* Setting up and managing the company's AWS infrastructure \n* Developing the application backend for the MVP \n* Designing the external API \n* Setting up automated build and testing infrastructure, and evangelizing TDD practices\n* Developing services to ingest data from Twitter, ArcGIS and other external sources \n* Managing configuration and schema changes to the application database \n* Prototyping and demonstrating the use of OOP principles in client-side Javascript design\n\nSome interesting features of Veoci that I designed and implemented: \n* User-configurable virtual database for storing structured data, also used as building block for many other features inside Veoci \n* User-configurable workflow management suite, with the ability to interact with other Veoci features and external systems through their API"
            }
          ],
          "edu":[
            {
              "school":"University of Florida",
              "degree":"BS, Computer Engineering",
              "year":"2007"
            }
          ]
        };
        resolve(results);
      },500);
    });
  }
};
