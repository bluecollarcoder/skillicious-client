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
var ActionCreator = require('./js/actions/CandidateSearchActions.react');
var FilterSettingsStore = require('./js/stores/FilterSettingsStore.react');
var CandidateStore = require('./js/stores/CandidateStore.react');

/*
 * Instantiate dispatcher and stores
 */
var filterSettingsStore = new FilterSettingsStore();
var candidateStore = new CandidateStore();
var dispatcher = new Dispatcher();

/*
 * Set up singleton action creator
 */
ActionCreator.setUp(dispatcher);

/*
 * Register dispatcher listeners
 */
dispatcher.register(function(action){
  dispatcher.waitFor([filterToken]);
  candidateStore.emit(action.actionType,action);
});
var filterToken = dispatcher.register(function(action){
 filterSettingsStore.emit(action.actionType,action);
});

/*
 * Render components
 */
React.render(<CandidateSearch candidateStore={candidateStore} filterSettingsStore={filterSettingsStore} />, $('#content')[0]);
/*
 * Trigger initial load
 */
ActionCreator.initialize();
window.setTimeout(function(){
  ActionCreator.refresh();
}, 5000);
