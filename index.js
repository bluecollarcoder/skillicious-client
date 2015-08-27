var React = require("react");

var SigninForm = React.createClass({
  "componentDidMount":function(){
    $('<link rel="stylesheet" type="text/css" href="/static/css/skillicious-signin-form.css" />').appendTo("head");
  },
  "render":function(){
    return (
      <div className="modal fade">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <form className="form-signin">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">x</span></button>
                <h4 className="modal-title form-signin-heading">Sign In</h4>
              </div>
              <div className="modal-body">
                <label htmlFor="inputEmail" className="sr-only">Email address</label>
                <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required autofocus />
                <label htmlFor="inputPassword" className="sr-only">Password</label>
                <input type="password" id="inputPassword" className="form-control" placeholder="Password" required />
                <div className="checkbox">
                  <label>
                    <input type="checkbox" value="remember-me" /> Remember me
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary btn-success" type="submit" onClick={this._doSignIn}>Sign in</button>
              </div>
            </form>
          </div> //.modal-content
        </div> //.modal-dialog
      </div> //.modal
    );
  },
  "_doSignIn":function(e){
    alert("Sign in");
  }
})

var signinComponent = React.render(<SigninForm />, $("<div></div>").appendTo("body")[0]);
$("#signin").on("click",function(e){
  $(signinComponent.getDOMNode()).modal();
});
