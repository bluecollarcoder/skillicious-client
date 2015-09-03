/*
 * Load external dependencies
 */
var React = require("react");
var Dispatcher = require("flux").Dispatcher;

/*
 * Global initialization
 */

// Load navbar React components
var UserSessionStore = require("./js/stores/UserSessionStore.react");
var UserSessionActionCreator = require('./js/actions/UserSessionActions.react');
var NavBarUserInfo = require('./js/components/NavBarUserInfo.react');

// Initialize navbar dispatcher and session store
var dispatcher = new Dispatcher();
var userSessionStore = new UserSessionStore();
var sessionStoreRegistration = dispatcher.register(function(action){
 userSessionStore.emit(action.actionType,action);
});

// Set up session API
require('./js/apis/UserSessionApi').setUp(userSessionStore);

// Set up session action creator
UserSessionActionCreator.setUp(dispatcher);

/*
 * Initialize the top navbar
 */
React.render(<NavBarUserInfo userSessionStore={userSessionStore}><li className="navbar-nav-button"><a href="/">Home</a></li></NavBarUserInfo>, $("#navbar-container")[0]);
UserSessionActionCreator.initialize();

/*
 * Global functions
 */
window.skillicious = window.skillicious || {};
window.skillicious.redirectToSignin = function(){
  setTimeout(function(){
    window.location.assign("/");
  },200);
};
window.skillicious.redirectToProfile = function(){
  window.location.assign("/profile");
};

/*
 * Page-specific initialization functions
 */

// Registration page
window.skillicious.initializeRegistrationForm = function(domElement){
  var RegistrationForm = require('./js/components/RegistrationForm.react');
  // If the user is already authenticated, redirect to the profile page.
  if (userSessionStore.principal)
    window.skillicious.redirectToProfile();
  else
    React.render(<RegistrationForm />, domElement);
};

// User profile page
var Router = require('react-router');
window.skillicious.initializeProfile = function(domElement){
  // Set up action creator
  var UserProfileActionCreator = require('./js/actions/UserProfileActions.react');
  UserProfileActionCreator.setUp(dispatcher);
  // Set up store
  var UserProfileStore = require('./js/stores/UserProfileStore.react');
  var userProfileStore = new UserProfileStore();
  // Register store with the dispatcher
  dispatcher.register(function(action){
    dispatcher.waitFor([sessionStoreRegistration]);
    userProfileStore.emit(action.actionType,action);
  });
  // Set up profile API
  require('./js/apis/UserProfileApi').setUp(userSessionStore);

  var UserProfile = require('./js/components/UserProfile.react');
  UserProfile.setUserProfileStore(userProfileStore);
  UserProfile.setUserSessionStore(userSessionStore);

  UserProfileActionCreator.initialize().catch(function(error){
    alert("Error loading profile");
  });
  Router.run(UserProfile.createRoutes(), Router.HashLocation, function(Root){
    React.render(<Root />, domElement);
  });
};
