/*
 * Load external dependencies
 */
var React = require("react");

/*
 * Load React components
 */
var UserSessionActionCreator = require('../actions/UserSessionActions.react');

var NavBarAvator = React.createClass({
  "render":function(){
    return (
      <li id="navbar-avator" className="dropdown navbar-nav-button">
        <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{this.props.principal.name} <span className="caret"></span></a>
        <ul className="dropdown-menu">
          <li><a href="/profile">Profile</a></li>
          <li><a href="#">Account</a></li>
          <li><a href="#">Settings</a></li>
          <li role="separator" className="divider"></li>
          <li><a href="#" onClick={this._doSignOut}>Sign Out</a></li>
        </ul>
      </li>
    );
  },
  "_doSignOut":function(){
    UserSessionActionCreator.signOut(this.props.token);
  }
});

var SignInForm = React.createClass({
  "getInitialState":function(){
    return {};
  },
  "componentDidMount":function(){
    $('<link rel="stylesheet" type="text/css" href="/static/css/skillicious-signin-form.css" />').appendTo("head");
  },
  "render":function(){
    return (
      <div id="sign-in-form-modal" className="modal fade">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <form className="form-signin" onSubmit={this._doSignIn}>
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">x</span></button>
                <h4 className="modal-title form-signin-heading">Sign In</h4>
              </div>
              <div className="modal-body">
                <label htmlFor="inputEmail" className="sr-only">Email address</label>
                <input ref="inputEmail" type="email" id="inputEmail" className="form-control" placeholder="Email address" required autofocus />
                <label htmlFor="inputPassword" className="sr-only">Password</label>
                <input ref="inputPassword" type="password" id="inputPassword" className="form-control" placeholder="Password" required />
                <div className="checkbox">
                  <label>
                    <input type="checkbox" value="remember-me" /> Remember me
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary btn-success" type="submit">Sign in</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  },
  "_doSignIn":function(e){
    e.preventDefault();
    var email = this.refs.inputEmail.getDOMNode().value;
    var password = this.refs.inputPassword.getDOMNode().value;
    if (!email || !password)
      return;
    UserSessionActionCreator.signIn(email,password);
  }
});

var NavBarSignIn = React.createClass({
  "componentDidMount":function(){
    // Render the sign-in form as well
    this.$signinForm = $('#sign-in-form-modal');
    if (!this.$signinForm.length){
      var signinComponent = React.render(<SignInForm />, $("<div></div>").appendTo("body")[0]);
      this.$signinForm = $(signinComponent.getDOMNode());
    }
  },
  "componentWillUnmount":function(){
    this.$signinForm.modal('hide');
  },
  "render":function(){
    return (
      <li id="navbar-signin" className="navbar-nav-button"><a id="signin" href="#" onClick={this._showSignInForm}>Sign In</a></li>
    );
  },
  "_showSignInForm":function(){
    this.$signinForm.modal();
  }
});

module.exports = React.createClass({
  "getInitialState":function(){
    return {
      "principal":null,
      "token":null
    };
  },
  "componentDidMount":function(){
    var self = this;
    this.props.userSessionStore.on("change",function(){
      // debugger;
      self.setState({
        "principal":self.props.userSessionStore.principal,
        "token":self.props.userSessionStore.token
      });
    });
  },
  "render":function(){
    // debugger;
    if (this.state.principal) {
      return (
        <ul className="nav navbar-nav navbar-right">
          <NavBarAvator principal={this.state.principal} token={this.state.token} />
        </ul>
      );
    } else {
      return (
        <ul className="nav navbar-nav navbar-right">
          {this.props.children}
          <NavBarSignIn />
          <li className="navbar-nav-button"><a id="register" href="register">Register</a></li>
        </ul>
      );
    }
  }
});
