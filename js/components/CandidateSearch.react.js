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
      "isLoading":false
    };
  },
  "componentDidMount":function(){
    var self = this;
    // Register listeners with the CandidateStore
    this.props.candidateStore.on("update",function(){
      self.setState({
        "candidates": self.props.candidateStore.candidates,
        "isLoading":false
      });
    }).on("loading",function(){
      self.setState({
        "isLoading":true
      });
    });
    // Initialize jQuery UI Tag-it plugin
    $(this.refs.txtFilter.getDOMNode()).tagit({
      "fieldName":"skills",
      "allowSpaces":true,
      "availableTags":["nodejs", "java", "sql", "javascript", "ruby", "python", "c"]
    });
    $(this.refs.btnFilter.getDOMNode()).button();
  },
  "componentWillUnmount":function(){
    // Unregister all listeners from the CandidateStore
    this.props.candidateStore.removeAllListeners("update").removeAllListeners("loading");
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
