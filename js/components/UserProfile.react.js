var React = require("react");
var Dispatcher = require("flux").Dispatcher;
var Router = require('react-router');
var _ = require('underscore');
var ActionCreator = require('../actions/UserProfileActions.react');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;
var Navigation = Router.Navigation;
var userProfileStore, userSessionStore;

// Used for internal events
var _dispatcher = new Dispatcher();

// Component for displaying a profile
var ProfileView = React.createClass({
  "render":function(){
    if (!this.props.profile)
      return null;

    var profile = this.props.profile;
    var completion = 0;
    var summary, skills, work, edu;

    if (profile.summary) {
      completion += .25;
      summary =
        <div className="profile-section profile-summary">
          <h3>Summary</h3>
          <p className="preformatted">{profile.summary}</p>
        </div>;
    }
    if (profile.skills && !_.isEmpty(profile.skills)) {
      completion += .25;
      skills =
        <div className="profile-section profile-skills">
          <h3>Skills</h3>
          <p>{
            _.map(profile.skills,function(level,key){
              var className = "tag ";
              switch (level) {
                case 1: className += "skill-working"; break;
                case 2: className += "skill-advanced"; break;
                case 3: className += "skill-expert"; break;
              }
              return <span className={className}>{key}</span>;
            })
          }</p>
        </div>;
    }
    if (profile.work && profile.work.length) {
      completion += .25;
      work =
        <div className="profile-section profile-work-experience">
          <h3>Work Experiences</h3>
          {_.map(profile.work,function(position){
            return <div className="work-position">
              <div className="position-employer">{position.employer}</div>
              <div className="position-title">{position.title}</div>
              <div className="position-duration">{position.start} - {position.end}</div>
              <div className="position-description preformatted">{position.desc}</div>
            </div>;
          })}
        </div>;
    }
    if (profile.edu && profile.edu.length) {
      completion += .25;
      edu =
        <div className="profile-section profile-education">
          <h3>Education</h3>
          {_.map(profile.edu,function(edu){
            return <div className="edu-degrees">
              <div className="degree-school">{edu.school}</div>
              <div className="degree-degree">{edu.degree}</div>
              <div className="degree-year">{edu.year}</div>
            </div>;
          })}
        </div>;
    }

    return (
      <div className="profile-container profile-view-container row">
        <div className="col-lg-9 col-md-9 col-sm-8">
          <div className="row">
            <div className="col-lg-4 col-md-4 hidden-sm">
              {/* Left column */}
              <div className="profile-photo">
                <img src="/static/img/linkedin_profile_photo.jpg" />
              </div>
            </div>
            <div className="col-lg-8 col-md-8 col-sm-12">
              {/* Middle column */}
              <h2>{this.props.principal.name}</h2>
              {summary}
              {skills}
              {work}
              {edu}
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-4">
          {/* Right column */}
          <div className="profile-completion profile-info-box">
            <div>Profile Completion: <span className="profile-completion-percent">{completion*100}%</span></div>
            <div className="progress">
              <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow={completion*100} aria-valuemin="0" aria-valuemax="100" style={{width:(completion*100)+"%"}}>
                <span className="sr-only"> Profile {completion*100}% complete</span>
              </div>
            </div>
            <a className="btn-profile-update" href="#edit">Update My Profile</a>
          </div>
        </div>
      </div>
    );
  }
});

// Component for displaying and editing a work history item
var WorkHistoryPosition = React.createClass({
  "getInitialState":function(){
    return {
      "mode":"view"
    };
  },
  "render":function(){
    var position = this.props.position;
    if (this.state.mode == 'edit')
      return <form className="work-position edit" onSubmit={this._onSave}>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-6"><input type="text" ref="txtEmployer" defaultValue={position.employer} required /></div>
          <div className="col-lg-6 col-md-6 col-sm-6"><input type="text" ref="txtTitle" defaultValue={position.title} required /></div>
        </div>
        <div className="position-duration"><input type="month" ref="txtStart" className="date-input" defaultValue={position.start} required /> -- <input type="month" ref="txtEnd" className="date-input" defaultValue={position.end} /></div>
        <div contentEditable ref="txtDesc" className="position-description preformatted editable profile-edit-input">{position.desc}</div>
        <div style={{"marginTop":"10px"}}>
          <button className="btn btn-sm btn-success">Save Position</button>
          <a className="btn-cancel" onClick={this._onCancel}>Cancel</a>
        </div>
      </form>;
    else
      return <div className="work-position">
        <div className="btn-work-history fa fa-times" title="Remove" onClick={this._onRemove}></div>
        <div className="btn-work-history fa fa-pencil" title="Edit" onClick={this._onEdit}></div>
        <div className="position-employer">{position.employer}</div>
        <div className="position-title">{position.title}</div>
        <div className="position-duration">{position.start} -- {position.end ? position.end : 'Present'}</div>
        <div className="position-description preformatted">{position.desc}</div>
      </div>;
  },
  // Called when the edit button is clicked. Switches the component to edit mode.
  "_onEdit":function(){
    this.setState({"mode":"edit"});
  },
  // Called when the remove button is clicked. Triggers action to remove this position.
  "_onRemove":function(e){
    _dispatcher.dispatch({
      "actionType":"remove-work-position",
      "index":this.props.index
    });
  },
  // Called when the save button is clicked. Triggers action to update this position.
  "_onSave":function(){
    var position = {
      "employer":this.refs.txtEmployer.getDOMNode().value,
      "title":this.refs.txtTitle.getDOMNode().value,
      "start":this.refs.txtStart.getDOMNode().value,
      "end":this.refs.txtEnd.getDOMNode().value,
      "desc":this.refs.txtDesc.getDOMNode().innerHTML
    };
    _dispatcher.dispatch({
      "actionType":"update-work-position",
      "index":this.props.index,
      "position":position
    });
    this.setState({"mode":"view"});
    return false;
  },
  // Called when the cancel button is clicked. Reverts this component back to view mode.
  "_onCancel":function(){
    this.setState({"mode":"view"});
  }
});

// Component for editing the work history section
var WorkHistory = React.createClass({
  "render":function(){
    var self = this;
    return <div className="work-history">
      {_.map(this.props.history,function(position,index){
        return <WorkHistoryPosition index={index} position={position} />;
      })}
      <form className="work-position add" onSubmit={this._onAdd}>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-6"><input type="text" ref="txtEmployer" placeholder="Company Name" required /></div>
          <div className="col-lg-6 col-md-6 col-sm-6"><input type="text" ref="txtTitle" placeholder="Job Title" required /></div>
        </div>
        <div className="position-duration"><input type="month" ref="txtStart" className="date-input" required /> -- <input type="month" ref="txtEnd" className="date-input" /></div>
        <div contentEditable ref="txtDesc" className="position-description preformatted editable profile-edit-input empty" onFocus={this._onFocus} onBlur={this._onBlur}>Description</div>
        <div style={{"marginTop":"10px"}}>
          <button className="btn btn-sm btn-success">Add Position</button>
          <a className="btn-cancel" onClick={this._onClear}>Clear</a>
        </div>
      </form>
    </div>;
  },
  // Called when the description box has focus
  "_onFocus":function(e){
    var editable = e.target;
    var $editable = $(editable);
    if ($editable.hasClass('empty')) {
      $editable.removeClass('empty');
      editable.innerHTML = '';
    }
  },
  // Called whene the description box loses focus
  "_onBlur":function(e){
    var editable = e.target;
    var $editable = $(editable);
    if (editable.innerHTML)
      $editable.removeClass('empty');
    else {
      $editable.addClass('empty');
      editable.innerHTML = 'Description';
    }
  },
  // Called when the "add" button is clicked
  "_onAdd":function(e){
    var editable = this.refs.txtDesc.getDOMNode();
    var $editable = $(editable);
    var position = {
      "employer":this.refs.txtEmployer.getDOMNode().value,
      "title":this.refs.txtTitle.getDOMNode().value,
      "start":this.refs.txtStart.getDOMNode().value,
      "end":this.refs.txtEnd.getDOMNode().value,
      "desc":$editable.hasClass('empty') ? null : editable.innerHTML
    };
    _dispatcher.dispatch({
      "actionType":"add-work-position",
      "position":position
    });
    this._onClear(e);
    return false;
  },
  // Called when the "cancel" button is clicked
  "_onClear":function(e){
    this.refs.txtEmployer.getDOMNode().value = null;
    this.refs.txtTitle.getDOMNode().value = null;
    this.refs.txtStart.getDOMNode().value = null;
    this.refs.txtEnd.getDOMNode().value = null;
    var editable = this.refs.txtDesc.getDOMNode();
    editable.innerHTML = 'Description';
    $(editable).addClass('empty');
  }
});

// Component for displaying and editing an education history item
var EduHistoryDegree = React.createClass({
  "getInitialState":function(){
    return {
      "mode":"view"
    };
  },
  "render":function(){
    var degree = this.props.degree;
    if (this.state.mode == 'edit')
      return <form className="edu-degree edit" onSubmit={this._onSave}>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-6"><input type="text" ref="txtSchool" defaultValue={degree.school} required /></div>
          <div className="col-lg-6 col-md-6 col-sm-6"><input type="text" ref="txtDegree" defaultValue={degree.degree} required /></div>
        </div>
        <div className="position-duration"><input type="text" ref="txtGradYear" className="date-input" defaultValue={degree.year} required pattern="\d{4}" /></div>
        <div style={{"marginTop":"10px"}}>
          <button className="btn btn-sm btn-success">Save Degree</button>
          <a className="btn-cancel" onClick={this._onCancel}>Cancel</a>
        </div>
      </form>;
    else
      return <div className="edu-degree">
        <div className="btn-work-history fa fa-times" title="Remove" onClick={this._onRemove}></div>
        <div className="btn-work-history fa fa-pencil" title="Edit" onClick={this._onEdit}></div>
        <div className="degree-school">{degree.school}</div>
        <div className="degree-degree">{degree.degree}</div>
        <div className="degree-year">{degree.year}</div>
      </div>;
  },
  // Called when the edit button is clicked. Switches the component to edit mode.
  "_onEdit":function(){
    this.setState({"mode":"edit"});
  },
  // Called when the remove button is clicked. Triggers action to remove this degree.
  "_onRemove":function(e){
    _dispatcher.dispatch({
      "actionType":"remove-edu-degree",
      "index":this.props.index
    });
  },
  // Called when the save button is clicked. Triggers action to update this degree.
  "_onSave":function(){
    var degree = {
      "school":this.refs.txtSchool.getDOMNode().value,
      "degree":this.refs.txtDegree.getDOMNode().value,
      "year":this.refs.txtGradYear.getDOMNode().value
    };
    _dispatcher.dispatch({
      "actionType":"update-edu-degree",
      "index":this.props.index,
      "degree":degree
    });
    this.setState({"mode":"view"});
    return false;
  },
  // Called when the cancel button is clicked. Reverts this component back to view mode.
  "_onCancel":function(){
    this.setState({"mode":"view"});
  }
});

// Component for editing the education history section
var EduHistory = React.createClass({
  "render":function(){
    var self = this;
    return <div className="edu-history">
      {_.map(this.props.history,function(degree,index){
        return <EduHistoryDegree degree={degree} index={index} />;
      })}
      <form className="edu-degree add" onSubmit={this._onAdd}>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-6"><input type="text" ref="txtSchool" placeholder="Institution" required /></div>
          <div className="col-lg-6 col-md-6 col-sm-6"><input type="text" ref="txtDegree" placeholder="Degree" required /></div>
        </div>
        <div className="edu-year"><input type="text" ref="txtGradYear" className="date-input" placeholder="Graduation Year" required pattern="\d{4}" /></div>
        <div style={{"marginTop":"10px"}}>
          <button className="btn btn-sm btn-success">Add Education</button>
          <a className="btn-cancel" onClick={this._onClear}>Clear</a>
        </div>
      </form>
    </div>;
  },
  // Called when the "add" button is clicked
  "_onAdd":function(e){
    var degree = {
      "school":this.refs.txtSchool.getDOMNode().value,
      "degree":this.refs.txtDegree.getDOMNode().value,
      "year":this.refs.txtGradYear.getDOMNode().value
    };
    _dispatcher.dispatch({
      "actionType":"add-edu-degree",
      "degree":degree
    });
    this._onClear(e);
    return false;
  },
  // Called when the "cancel" button is clicked
  "_onClear":function(e){
    this.refs.txtSchool.getDOMNode().value = null;
    this.refs.txtDegree.getDOMNode().value = null;
    this.refs.txtGradYear.getDOMNode().value = null;
  }
});

// Component for editing a profile
var ProfileEdit = React.createClass({
  "getInitialState":function(){
    return {
      "profile":_.extend({},this.props.profile), // Clone a new object so that we can easily rollback changes
      "loaded":this.props.profile != null
    };
  },
  "componentDidMount":function(){
    var self = this;
    // Register ProfileEdit with the dispatcher
    _dispatcher.register(function(action){
      var profile = _.extend({},self.state.profile);
      switch (action.actionType) {
        case "add-work-position":
          if (!profile.work) profile.work = [];
          profile.work.unshift(action.position);
          break;
        case "update-work-position":
          if (profile.work)
            profile.work[action.index] = action.position;
          break;
        case "remove-work-position":
          if (profile.work)
            profile.work = profile.work.filter(function(position,index){
              return index != action.index;
            });
        case "add-edu-degree":
          if (!profile.edu) profile.edu = [];
            profile.edu.unshift(action.degree);
          break;
        case "update-edu-degree":
          if (profile.edu)
            profile.edu[action.index] = action.degree;
          break;
        case "remove-edu-degree":
          if (profile.edu)
            profile.edu = profile.edu.filter(function(position,index){
              return index != action.index;
            });
          break;
      }
      self.setState({"profile":profile});
    });
  },
  "componentWillUpdate":function(newProp,newState){
    // The profile is not passed in props if the page starts in the edit mode,
    // only when the route changes. This is added to save the profile to the state
    // when the route changes.
    if (newProp.profile && !this.state.loaded)
      this.setState({
        "profile":newProp.profile,
        "loaded":true
      });
  },
  "render":function(){
    if (!this.state.profile)
      return null;

    var profile = this.state.profile;
    var completion = 0;

    completion += (profile.summary) ? .25 : 0;
    completion += (profile.skills && !_.isEmpty(profile.skills)) ? .25 : 0;
    completion += (profile.work && profile.work.length) ? .25 : 0;
    completion += (profile.edu && profile.edu.length) ? .25 : 0;

    var summary =
      <div className="profile-section profile-summary">
        <h3>Summary</h3>
        <div contentEditable ref="txtSummary" className="preformatted editable profile-edit-input">
          {profile.summary ? profile.summary : null}
        </div>
      </div>;
    var skills =
      <div className="profile-section profile-skills">
        <h3>Skills</h3>
        <p>{
          _.map(profile.skills||{},function(level,key){
            var className = "tag ";
            switch (level) {
              case 1: className += "skill-working"; break;
              case 2: className += "skill-advanced"; break;
              case 3: className += "skill-expert"; break;
            }
            return <span className={className}>{key}</span>;
          })
        }</p>
      </div>;
    var work =
      <div className="profile-section profile-work-history">
        <h3>Work Experiences</h3>
        <WorkHistory history={profile.work} />
      </div>;
    var edu =
      <div className="profile-section profile-education">
        <h3>Education</h3>
        <EduHistory history={profile.edu} />
      </div>;

    return (
      <div className="profile-container profile-edit-container row">
        <div className="col-lg-3 col-md-3 col-sm-4">
          {/* Left column */}
          <div className="profile-completion profile-info-box" style={{"marginBottom":"20px"}}>
            <div>Profile Completion: <span className="profile-completion-percent">{completion*100}%</span></div>
            <div className="progress">
              <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow={completion*100} aria-valuemin="0" aria-valuemax="100" style={{width:(completion*100)+"%"}}>
                <span className="sr-only"> Profile {completion*100}% complete</span>
              </div>
            </div>
          </div>
          <div className="profile-photo profile-info-box" style={{"marginBottom":"20px"}}>
            <img src="/static/img/linkedin_profile_photo.jpg" />
            <a className="btn-profile-photo-update" href="#edit">Change Photo</a>
          </div>
        </div>
        <div className="col-lg-9 col-md-9 col-sm-8">
          {/* Right column */}
          <div>
            <h2>{this.props.principal.name}</h2>
            {summary}
            {skills}
            {work}
            {edu}
          </div>
          <button className="btn btn-success" onClick={this._doSave}>Save Profile</button>
          <a href="#" style={{margin:"20px"}}>Cancel</a>
        </div>
      </div>
    );
  },
  "_doSave":function(e){
    ActionCreator.updateProfile(this.props.profile);
  }
});

// Top-level component that sets up the React routes
var UserProfile = React.createClass({
  "mixins":[Navigation],
  "statics":{
    "setUserProfileStore":function(store){
      userProfileStore = store;
    },
    "setUserSessionStore":function(store){
      userSessionStore = store;
    },
    "createRoutes":function(){
      return (
        <Route handler={UserProfile}>
          <DefaultRoute name="view" handler={ProfileView} />
          <Route name="edit" path="edit" handler={ProfileEdit} />
        </Route>
      );
    }
  },
  "getInitialState":function(){
    return {
      "principal":userSessionStore.principal,
      "profile":null
    };
  },
  "componentDidMount":function(){
    var self = this;
    // Listen to "change" event on the UserProfileStore
    userProfileStore.on("change",function(opt){
      self.setState({
        "profile":userProfileStore.profile ? userProfileStore.profile : null
      });
      if (_.isEmpty(self.state.profile))
        // If the user has an empty profile object, take her to the edit screen
        self.transitionTo('edit');
      else if (opt && opt.mode)
        // If the event has an option for mode, go to that mode
        self.transitionTo(opt.mode);
    });
    // Listen to "change" event on the UserSessionStore
    userSessionStore.on("change",function(){
      var principal = userSessionStore.principal;
      // If user not signed in, redirect to sign-in page
      if (!principal)
        window.skillicious.redirectToSignin();
      else
        self.setState({
          "principal":principal
        });
    });
  },
  "render":function(){
    return (
      <div>
        <RouteHandler principal={this.state.principal} profile={this.state.profile} />
      </div>
    );
  }
});

module.exports = UserProfile;
