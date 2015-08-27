var Assert = require("chai").assert;
var sinon = require("sinon");
var jsdom = require("jsdom");
var UserSessionStore = require("../../js/stores/UserSessionStore.react");

describe("User Session Store Tests",function(){
  // Before any test is run, set up the window object
  before(function(done){
    var self = this;

    jsdom.env("<!DOCTYPE html><html><body></body></html>",function(err,_window){
      window = _window;
      window.sessionStorage = {
        "getItem":function(){},
        "setItem":function(){},
        "removeItem":function(){}
      };
      self.stub = sinon.stub(window.sessionStorage,"getItem");
      self.setItemSpy = sinon.spy(window.sessionStorage,"setItem");
      self.removeItemSpy = sinon.spy(window.sessionStorage,"removeItem");
      done();
    });
  });

  // Before each test, re-initialize the store
  beforeEach(function(){
    this.store = new UserSessionStore();
  });

  // After each test, reset the sessionStorage
  afterEach(function(){
    this.stub.reset();
    this.setItemSpy.reset();
  });

  it("should initialize from sessionStorage",function(done){
    var self = this;

    var expected = {"principal":{
      "id":1,
      "name":"wayne"
    },"token":"ABCDEFGHI"};
    this.stub.withArgs("skillicious.session.principal").returns(JSON.stringify(expected.principal));
    this.stub.withArgs("skillicious.session.token").returns(expected.token);

    this.store.on("initialize",function(){
      Assert.ok(self.stub.calledTwice);
      Assert.deepEqual(self.store.principal,expected.principal);
      Assert.equal(self.store.token,expected.token);
      done();
    });
    this.store.emit("initialize",{"actionType":"initialize"});
  });

  it("should initialize blank",function(done){
    var self = this;
    this.stub.withArgs("skillicious.session.token").returns(null);

    this.store.on("initialize",function(){
      console.log("Inside event handler");
      Assert.ok(self.stub.calledTwice);
      console.log("Checked calledTwice");
      Assert.isNull(self.store.principal);
      Assert.isNull(self.store.token);
      done();
    });
    this.store.emit("initialize",{"actionType":"initialize"});
  });

  it("should save session to sessionStorage on signin_success",function(done){
    var self = this;
    var expected = {
      "principal":{
        "id":1,
        "name":"wayne"
      },
      "token":"ABCDEFGHI"
    };

    this.store.on("signin_success",function(){
      Assert.ok(self.setItemSpy.calledTwice);
      Assert.equal(self.setItemSpy.getCall(0).args[0],"skillicious.session.principal");
      Assert.equal(self.setItemSpy.getCall(0).args[1],JSON.stringify(expected.principal));
      Assert.equal(self.setItemSpy.getCall(1).args[0],"skillicious.session.token");
      Assert.equal(self.setItemSpy.getCall(1).args[1],expected.token);
      Assert.deepEqual(self.store.principal,expected.principal);
      Assert.equal(self.store.token,expected.token);
      done();
    });
    this.store.emit("signin_success",{
      "actionType":"signin_success",
      "principal":expected.principal,
      "token":expected.token
    });
  });

  it("should clear session on signout",function(done){
    var self = this;

    this.store.on("signout",function(){
      Assert.ok(self.removeItemSpy.calledTwice);
      Assert.equal(self.removeItemSpy.getCall(0).args[0],"skillicious.session.principal");
      Assert.equal(self.removeItemSpy.getCall(1).args[0],"skillicious.session.token");
      Assert.isNull(self.store.principal);
      Assert.isNull(self.store.token);
      done();
    });
    this.store.emit("signout",{
      "actionType":"signout"
    });
  });
});
