/*
 * Load external dependencies
 */
var React = require("react");
var Dispatcher = require("flux").Dispatcher;

/*
 * Load React components
 */
var UserSessionStore = require("./js/stores/UserSessionStore.react");
var UserSessionActionCreator = require('./js/actions/UserSessionActions.react');
var NavBarUserInfo = require('./js/components/NavBarUserInfo.react');
var RegistrationForm = require('./js/components/RegistrationForm.react');

/*
 * Instantiate dispatcher and stores
 */
var dispatcher = new Dispatcher();
var userSessionStore = new UserSessionStore();

/*
 * Set up singleton action creator
 */
UserSessionActionCreator.setUp(dispatcher);

/*
 * Register dispatcher listeners
 */
dispatcher.register(function(action){
  userSessionStore.emit(action.actionType,action);
});

/*
 * Initialize the top navbar
 */
React.render(<NavBarUserInfo userSessionStore={userSessionStore}><li className="navbar-nav-button"><a href="/">Home</a></li></NavBarUserInfo>, $("#navbar-container")[0]);
UserSessionActionCreator.initialize();

/*
 * Page-specific initialization functions
 */
window.skillicious = window.skillicious || {};
window.skillicious.initializeRegistrationForm = function(){
  React.render(<RegistrationForm />, $("#registration-form-container")[0]);
};
