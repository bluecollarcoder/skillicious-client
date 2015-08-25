/*
 * Load external dependencies
 */
var $ = require('jquery');
var _ = require('underscore');
var React = require('react');

// Dependencies for tag-it plugin
jQuery = $;
require('jquery-ui');
require('../../lib/tag-it/tag-it.js');

/*
 * Load React components
 */
var CandidateStore = require('../stores/CandidateStore.react');

/*
 * Define React components
 */

/**
 * The main candidate search component
 * @type {ReactClass}
 */
var CandidateSearch = React.createClass({
  "getInitialState":function(){
    return {
      // The candidates being shown
      "candidates":this.props.candidateStore.candidates,
      // Is the list of candidates being updated
      "isLoading":false,
      "availableTags":[]
    };
  },
  "componentDidMount":function(){
    var self = this;

    // Register listeners with the FilterTermsStore
    this.props.filterTermsStore.on("initialize",function(){
      if (self.props.filterTermsStore.terms)
        _.each(self.props.filterTermsStore.terms.split(','),function(_term){
          $txtTerms.tagit('createTag',_term);
        });
    });

    // Register listeners with the CandidateStore
    this.props.candidateStore.on("filter",function(){
      // Filter the candidates based on filter terms
      self.setState({
        "candidates": self.props.candidateStore.candidates
      });
    }).on("loading",function(){
      // Show the loading placeholder
      self.setState({
        "isLoading":true
      });
    }).on("update",function(){
      // Update the list and reset filter tags
      var skills = _.flatten(
        _.map(self.props.candidateStore.candidates,function(candidate){
          return Object.keys(candidate.getSkills());
        })
      );
      self.setState({
        "candidates": self.props.candidateStore.candidates,
        "isLoading":false,
        "availableTags":skills
      });
    });

    // Initialize jQuery UI Tag-it plugin
    var $txtTerms = $(this.refs.txtFilter.getDOMNode()).tagit({
      "fieldName":"skills",
      "allowSpaces":true,
      "autocomplete":{
        "source":function(search, showChoices) {
          var filter = search.term.toLowerCase();
          var choices = $.grep(self.state.availableTags, function(element) {
            // Only match autocomplete options that begin with the search term.
            // (Case insensitive.)
            return (element.toLowerCase().indexOf(filter) === 0);
          });
          if (!this.options.allowDuplicates) {
            choices = this._subtractArray(choices, this.assignedTags());
          }
          showChoices(choices);
        }
      }
    });

    $(this.refs.btnFilter.getDOMNode()).button();
  },
  "componentWillUnmount":function(){
    // Unregister all listeners from the CandidateStore
    this.props.candidateStore.removeAllListeners("filter").removeAllListeners("update").removeAllListeners("loading");
    this.props.filterTermsStore.removeAllListeners("initialize");
  },
  "handleClick":function(){
    var filterTerms = this.refs.txtFilter.getDOMNode().value;
    // Dispatch the filter event with the dispatcher
    this.props.dispatcher.dispatch({
      "actionType":"filter",
      "filterTerms":filterTerms
    });
  },
  "render":function(){
    var results = (this.state.isLoading) ?
      <div>Loading...</div> :
      <ResultList ref="lstResult" candidates={this.state.candidates} isLoading={false} />;
    return (
      <div>
        <div><input ref="txtFilter" type="text" id="txtFilter" /><button ref="btnFilter" onClick={this.handleClick}>Filter</button></div>
        {results}
      </div>
    );
  }
});

/**
 * The list of candidates
 * @type {ReactClass}
 */
var ResultList = React.createClass({
  "render":function(){
    var candidates = this.props.candidates.map(function(candidate){
      return (<CandidateView name={candidate.getName()} skills={candidate.getSkills()} />);
    });
    return (
      <div>
        {candidates}
      </div>
    );
  }
});

/**
 * The list item for each candidate
 * @type {ReactClass}
 */
var CandidateView = React.createClass({
  "render":function(){
    var skills = _.map(this.props.skills, function(level,skill){
      var expertise;
      switch (level) {
        case 1:
          expertise = 'Working experience';
          break;
        case 2:
          expertise = "Advanced knowledge";
          break;
        case 3:
          expertise = "Expert";
          break;
        default:
          return;
      }
      return (<span style={{padding: '3px', margin: '3px'}}>{skill} ({expertise})</span>);
    });
    return (
      <div>
        <div>{this.props.name}</div>
        <p>{skills}</p>
      </div>
    );
  }
});

module.exports = CandidateSearch;
