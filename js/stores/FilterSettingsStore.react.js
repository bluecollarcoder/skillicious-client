var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

function FilterSettingsStore(){
  // Call super constructor
  EventEmitter.call(this);
  // Decorate object with addition methods
  _.extend(this,{
    "terms":"",
    "emit":function(type,action){
      switch (type) {
        case 'initialize':
          this.terms = action.filterTerms || window.localStorage.getItem("skillicious.candidates.filterTerms") || "";
        case 'filter':
          if (arguments.length > 1 && action.filterTerms != null) {
            this.terms = action.filterTerms;
            window.localStorage.setItem("skillicious.candidates.filterTerms",this.terms);
          }
          EventEmitter.prototype.emit.call(this,type);
          break;
        // Unrecognized action; ignore
      }
    }
  });
}
FilterSettingsStore.prototype = Object.create(EventEmitter.prototype);
FilterSettingsStore.prototype.constructor = FilterSettingsStore;

module.exports = FilterSettingsStore;
