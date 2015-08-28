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

React.render(<NavBarUserInfo userSessionStore={userSessionStore}><li><a href="#">Home</a></li></NavBarUserInfo>, $("#navbar-container")[0]);

UserSessionActionCreator.initialize();
