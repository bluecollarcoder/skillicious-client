var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

function UserSessionStore(){
  // Call super constructor
  EventEmitter.call(this);
  // Decorate object with addition methods
  _.extend(this,{
    "principal":null,
    "token":null,
    "emit":function(type,action){
      switch (type) {
        case 'initialize':
          var principal = JSON.parse(window.sessionStorage.getItem("skillicious.session.principal")) || null;
          var token = window.sessionStorage.getItem("skillicious.session.token") || null;
          if (principal && token) {
            this.principal = principal;
            this.token = token;
          }
          EventEmitter.prototype.emit.call(this,"change");
          break;
        case 'signin_success':
          if (arguments.length > 1 && action.principal != null && action.token != null) {
            window.sessionStorage.setItem("skillicious.session.principal",JSON.stringify(this.principal=action.principal));
            window.sessionStorage.setItem("skillicious.session.token",this.token=action.token);
            EventEmitter.prototype.emit.call(this,"change");
            // Redirect based on the user's role
            switch (this.principal.role) {
              case "candidate":
                window.location.href = "/profile";
                break;
              case "recruiter":
                window.location.href = "/profile";
                break;
            }
          }
          break;
        case 'signin_failure':
          EventEmitter.prototype.emit.call(this,"signin_failure");
          alert(action.error.message);
          break;
        case 'signout_success':
        case 'expire':
          this.principal = null;
          this.token = null;
          window.sessionStorage.removeItem("skillicious.session.principal");
          window.sessionStorage.removeItem("skillicious.session.token");
          EventEmitter.prototype.emit.call(this,"change");
          break;
        case 'registration_success':
          if (arguments.length > 1 && action.principal != null && action.token != null) {
            window.sessionStorage.setItem("skillicious.session.principal",JSON.stringify(this.principal=action.principal));
            window.sessionStorage.setItem("skillicious.session.token",this.token=action.token);
            EventEmitter.prototype.emit.call(this,"change");
            // Redirect based on the user's role
            switch (this.principal.role) {
              case "candidate":
                window.location.href = "/profile";
                break;
              case "recruiter":
                window.location.href = "/profile";
                break;
            }
          }
          break;
        case 'registration_failure':
          alert(action.error.message);
          break;
        // Unrecognized action; ignore
      }
    }
  });
}
UserSessionStore.prototype = Object.create(EventEmitter.prototype);
UserSessionStore.prototype.constructor = UserSessionStore;

module.exports = UserSessionStore;
