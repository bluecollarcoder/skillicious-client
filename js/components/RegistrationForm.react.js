var React = require('react');
var ActionCreator = require('../actions/UserSessionActions.react');

var UserRegistrationForm = React.createClass({
  "render":function(){
    return (
      <form onSubmit={this._doRegister}>
        <div className="form-header">
          <h3>Register Now</h3>
          <p>Register now to create your talent profile.</p>
        </div>
        <div className="form-body">
          <div className="row">
            <div className="col-sm-4"><label htmlFor="inputName">Name</label></div>
            <div className="col-sm-8"><input ref="inputName" type="text" id="inputName" className="form-control" placeholder="First &amp; last name" required autofocus pattern="\w+\s+\w+" /></div>
          </div>
          <div className="row">
            <div className="col-sm-4"><label htmlFor="inputEmail">Email address</label></div>
            <div className="col-sm-8"><input ref="inputEmail" type="email" id="inputEmail" className="form-control" placeholder="you@example.com" required /></div>
          </div>
          <div className="row">
            <div className="col-sm-4"><label htmlFor="inputPassword">Password</label></div>
            <div className="col-sm-8"><input ref="inputPassword" type="password" id="inputPassword" className="form-control" placeholder="Minimum 8 characters" required pattern=".{8,}" /></div>
          </div>
        </div>
        <div className="form-footer">
          <button className="btn btn-success">Register</button>
        </div>
      </form>
    );
  },
  "_doRegister":function(e){
    e.preventDefault();
    var name = this.refs.inputName.getDOMNode().value;
    var email = this.refs.inputEmail.getDOMNode().value;
    var password = this.refs.inputPassword.getDOMNode().value;
    if (!name || !email || !password)
      return;
    ActionCreator.registerUser(name,email,password);
  }
});

var CompanyRegistrationForm = React.createClass({
  "render":function(){
    return (
      <form onSubmit={this._doRegister}>
        <div className="form-header">
          <h3>Employer Registration</h3>
          <p>Register your company now and get access to thousands of qualified job-seekers.</p>
        </div>
        <div className="form-body">
          <div className="row">
            <div className="col-sm-4"><label htmlFor="inputCompany">Company</label></div>
            <div className="col-sm-8"><input ref="inputCompany" type="text" id="inputCompany" className="form-control" placeholder="Company name" required autofocus /></div>
          </div>
          <div className="row">
            <div className="col-sm-4"><label htmlFor="inputLocation">Location</label></div>
            <div className="col-sm-8"><input ref="inputLocation" type="text" id="inputLocation" className="form-control" placeholder="City, State" required pattern="\w+,\s*\w+" /></div>
          </div>
          <div className="row">
            <div className="col-sm-4"><label htmlFor="inputName">Your Name</label></div>
            <div className="col-sm-8"><input ref="inputName" type="text" id="inputName" className="form-control" placeholder="First &amp; last name" required pattern="\w+\s+\w+" /></div>
          </div>
          <div className="row">
            <div className="col-sm-4"><label htmlFor="inputEmail">Email address</label></div>
            <div className="col-sm-8"><input ref="inputEmail" type="email" id="inputEmail" className="form-control" placeholder="you@example.com" required /></div>
          </div>
          <div className="row">
            <div className="col-sm-4"><label htmlFor="inputPassword">Password</label></div>
            <div className="col-sm-8"><input ref="inputPassword" type="password" id="inputPassword" className="form-control" placeholder="Minimum 8 characters" required pattern=".{8,}" /></div>
          </div>
        </div>
        <div className="form-footer">
          <button className="btn btn-success">Register</button>
        </div>
      </form>
    );
  },
  "_doRegister":function(e){
    e.preventDefault();
    var company = this.refs.inputCompany.getDOMNode().value;
    var location = this.refs.inputLocation.getDOMNode().value;
    var name = this.refs.inputName.getDOMNode().value;
    var email = this.refs.inputEmail.getDOMNode().value;
    var password = this.refs.inputPassword.getDOMNode().value;
    if (!company || !location || !name || !email || !password)
      return;
    ActionCreator.registerEmployer(company,location,name,email,password);
  }
});

var RegistrationForm = React.createClass({
  "render":function(){
    return (
      <div className="nav-tabs-container">
        <ul className="nav nav-tabs" role="tablist">
          <li className="active">
              <a href="#talent" role="tab" data-toggle="tab">
                  <icon className="fa fa-home"></icon> Talent
              </a>
          </li>
          <li><a href="#employer" role="tab" data-toggle="tab">
              <i className="fa fa-user"></i> Employer
              </a>
          </li>
        </ul>
        <div className="tab-content">
          <div className="tab-pane fade active in" id="talent">
            <UserRegistrationForm />
          </div>
          <div className="tab-pane fade" id="employer">
            <CompanyRegistrationForm />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = RegistrationForm;
