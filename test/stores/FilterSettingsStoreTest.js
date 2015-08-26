var Assert = require("chai").assert;
var sinon = require("sinon");
var jsdom = require("jsdom");
var FilterSettingsStore = require("../../js/stores/FilterSettingsStore.react");

describe("Filter Settings Store Tests",function(){
  // Before any test is run, set up the window object
  before(function(done){
    var self = this;

    jsdom.env("<!DOCTYPE html><html><body></body></html>",function(err,_window){
      window = _window;
      window.localStorage = {
        "getItem":function(){},
        "setItem":function(){}
      };
      self.stub = sinon.stub(window.localStorage,"getItem");
      self.spy = sinon.spy(window.localStorage,"setItem");
      done();
    });
  });

  // Before each test, re-initialize the store
  beforeEach(function(){
    this.store = new FilterSettingsStore();
  });

  // After each test, reset the localStorage
  afterEach(function(){
    this.stub.reset();
    this.spy.reset();
  });

  it("should initialize from localStorage",function(done){
    var self = this;
    this.stub.returns("Hello");

    this.store.on("initialize",function(){
      Assert.ok(self.stub.calledOnce);
      Assert.equal(self.store.terms,"Hello");
      done();
    });
    this.store.emit("initialize",{"actionType":"initialize"});
  });

  it("should initialize from action",function(done){
    var self = this;
    var expected = "Hello,World";

    this.store.on("initialize",function(){
      Assert.ok(!self.stub.called);
      Assert.equal(self.store.terms,expected);
      done();
    });
    this.store.emit("initialize",{"actionType":"initialize","filterTerms":expected});
  });

  it("should save filter terms to localStorage",function(done){
    var self = this;
    var expected = "Hello,World";

    this.store.on("filter",function(){
      Assert.ok(self.spy.calledOnce);
      Assert.ok(self.spy.calledWithExactly("skillicious.candidates.filterTerms",expected));
      Assert.equal(self.store.terms,expected);
      done();
    });
    this.store.emit("filter",{"actionType":"filter","filterTerms":expected});
  });
});
