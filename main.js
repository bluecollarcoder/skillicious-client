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
var CandidateStore = require('./js/stores/CandidateStore.react');

/*
 * Instantiate dispatcher and stores
 */
var candidateStore = new CandidateStore(data);
var dispatcher = new Dispatcher();

/*
 * Register dispatcher listeners
 */
dispatcher.register(function(action){
  candidateStore.emit(action.actionType,action);
});

/*
 * Render components
 */
React.render(<CandidateSearch dispatcher={dispatcher} candidateStore={candidateStore} />, $('#content')[0]);

/*
 * Trigger initial load
 */
dispatcher.dispatch({
  "actionType":"update-candidates"
})
