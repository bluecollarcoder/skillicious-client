/*
 * Load external dependencies
 */
var $ = require('jquery');
var React = require('react');
var Dispatcher = require('flux').Dispatcher;

/*
 * Load React components
 */
var CandidateSearch = require('./js/components/CandidateSearch.react');
var FilterTermsStore = require('./js/stores/FilterTermsStore.react');
var CandidateStore = require('./js/stores/CandidateStore.react');

/*
 * Instantiate dispatcher and stores
 */
var filterTermsStore = new FilterTermsStore("");
var candidateStore = new CandidateStore(filterTermsStore,data);
var dispatcher = new Dispatcher();

/*
 * Register dispatcher listeners
 */
dispatcher.register(function(action){
  dispatcher.waitFor([filterToken]);
  candidateStore.emit(action.actionType,action);
});
var filterToken = dispatcher.register(function(action){
 filterTermsStore.emit(action.actionType,action);
});

/*
 * Render components
 */
React.render(<CandidateSearch dispatcher={dispatcher} candidateStore={candidateStore} filterTermsStore={filterTermsStore} />, $('#content')[0]);
/*
 * Trigger initial load
 */
dispatcher.dispatch({
  "actionType":"initialize"
});
window.setTimeout(function(){
  data.push(new Candidate({
    "name":"Full-stack Joe",
    "skills":{
      "NodeJS":2,
      "MongoDB":2,
      "Javascript":2,
      "Java":2,
      "SQL":2
    }
  }));
  debugger;
  dispatcher.dispatch({
    "actionType":"refresh",
    "candidates":data
  });
}, 5000);
