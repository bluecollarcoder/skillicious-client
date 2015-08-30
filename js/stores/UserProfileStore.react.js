var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

function UserProfileStore(){
  // Call super constructor
  EventEmitter.call(this);
  // Decorate object with addition methods
  _.extend(this,{
    "profile":null,
    "emit":function(type,action){
      switch (type) {
        case 'initialize':
          this.profile = action.profile;
          EventEmitter.prototype.emit.call(this,"change");
          break;
        case 'update_success':
          this.profile = action.profile;
          EventEmitter.prototype.emit.call(this,"change",{"mode":"view"});
          break;
        case 'update_failure':

          break;
        // Unrecognized action; ignore
      }
    }
  });
}
UserProfileStore.prototype = Object.create(EventEmitter.prototype);
UserProfileStore.prototype.constructor = UserProfileStore;

module.exports = UserProfileStore;
