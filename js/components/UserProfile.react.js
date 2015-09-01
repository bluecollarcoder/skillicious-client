var React = require("react");
var Router = require('react-router');
var _ = require('underscore');
var ActionCreator = require('../actions/UserProfileActions.react');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;
var Navigation = Router.Navigation;
var userProfileStore, userSessionStore;

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

var ProfileEdit = React.createClass({
  "render":function(){
    if (!this.props.profile)
      return null;

    var profile = this.props.profile;
    var completion = 0;
    var summary, skills, work, edu;

    completion += (profile.summary) ? .25 : 0;
    completion += (profile.skills && !_.isEmpty(profile.skills)) ? .25 : 0;
    completion += (profile.work && profile.work.length) ? .25 : 0;
    completion += (profile.edu && profile.edu.length) ? .25 : 0;

    summary =
      <div className="profile-section profile-summary">
        <h3>Summary</h3>
        <div contentEditable ref="txtSummary" className="preformatted editable profile-edit-input">
          {profile.summary ? profile.summary : null}
        </div>
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
          </div>
          <button className="btn btn-success" onClick={this._doSave}>Save</button>
        </div>
      </div>
    );
  },
  "_doSave":function(e){
    ActionCreator.updateProfile(this.props.profile);
  }
});

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
        "profile":userProfileStore.profile ? userProfileStore.profile : {}
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
