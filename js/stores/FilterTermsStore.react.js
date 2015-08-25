var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

function FilterTermsStore(terms){
  // Call super constructor
  EventEmitter.call(this);
  // Decorate object with addition methods
  _.extend(this,{
    "terms":terms,
    "emit":function(type){
      switch (type) {
        case 'initialize':
          this.terms = window.localStorage["skillicious.candidates.filterTerms"] || "";
        case 'filter':
          if (arguments.length > 1 && arguments[1].filterTerms != null) {
            this.terms = arguments[1].filterTerms;
            window.localStorage["skillicious.candidates.filterTerms"] = this.terms;
          }
          EventEmitter.prototype.emit.call(this,type);
          break;
        // Unrecognized action; pass it as-is
        default:
          EventEmitter.prototype.emit.apply(this,arguments);
      }
    }
  });
}
FilterTermsStore.prototype = Object.create(EventEmitter.prototype);
FilterTermsStore.prototype.constructor = FilterTermsStore;

module.exports = FilterTermsStore;
