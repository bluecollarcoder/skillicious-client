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
function CandidateStore() {
  // Call super constructor
  EventEmitter.call(this);

  // Decorate object with addition methods
  _.extend(this,{
    // An array of candidates being shown in the results list
    "candidates":[],
    // The emit method is triggered by the dispatcher when an action is dispatched
    "emit":function(type,action){
      // Filter action based on type
      switch (type) {
        // The initialize action is triggered when the store is first loaded
        // The refresh action is triggered when an external element causes the list to be reloaded
        case "initialize":
          EventEmitter.prototype.emit.call(this,"loading");
          if (!action.hasOwnProperty("candidates"))
            break;
        case "refresh":
          // Load candidates
          this.candidates = action.candidates;
          // Trigger the components to reload the results
          EventEmitter.prototype.emit.call(this,"update");
          break;
        // Unrecognized action; ignore
      }
    }
  });
}
CandidateStore.prototype = Object.create(EventEmitter.prototype);
CandidateStore.prototype.constructor = CandidateStore;

module.exports = CandidateStore;
