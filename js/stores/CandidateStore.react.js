/*
 * Load external dependencies
 */
var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;

/*
 * Define React components
 */

/**
 * @type {object} Flux store for storing list of candidates
 * @param {array} Initial list of candidates to be rendered
 */
function CandidateStore(candidates) {
  // Call super constructor
  EventEmitter.call(this);
  // Decorate object with addition methods
  _.extend(this,{
    // An array of candidates being shown in the results list
    "candidates":candidates,
    // The emit method is triggered by the dispatcher when an action is dispatched
    "emit":function(type){
      // Filter action based on type
      switch (type) {
        // The filter action is triggered when the user modify the list of filter terms
        case "filter":
          var filterTerms = arguments[1].filterTerms;
          this.candidates = data.filter(function(candidate){
            return _.keys(candidate.getSkills()).some(function(skill){
              if (!filterTerms.length)
                return true;
              else {
                return _.contains(
                  filterTerms.split(/\s*,\s*/).map(function(val){
                    return val.toUpperCase();
                  }),
                  skill.toUpperCase()
                );
              }
            });
          });
          // Trigger the components to reload the results
          EventEmitter.prototype.emit.call(this,"update");
          break;
        // The update-candidates action is triggered when an external element causes the list to be reloaded
        case "update-candidates":
          EventEmitter.prototype.emit.call(this,"loading");
          // Load candidates
          this.candidates = candidates;
          // Trigger the components to reload the results
          EventEmitter.prototype.emit.call(this,"update");
          break;
        // Unrecognized action; pass it as-is
        default:
          EventEmitter.prototype.emit.apply(this,arguments);
      }
    }
  });
}
CandidateStore.prototype = Object.create(EventEmitter.prototype);
CandidateStore.prototype.constructor = CandidateStore;

module.exports = CandidateStore;
