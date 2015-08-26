var Assert = require("chai").assert;
var sinon = require("sinon");
var Promise = require("rsvp").Promise;
var Dispatcher = require("flux").Dispatcher;
var ActionCreator = require("../../js/actions/CandidateSearchActions.react.js");
var CandidateApi = require('../../js/apis/CandidateApi');

describe("Candidate Search Action Tests",function(){
  // Before any test is run, stub the API.
  before(function(){
    this.stub = sinon.stub(CandidateApi,"getAllCandidates");
    this.stub.returns(new Promise(function(resolve,reject){
      resolve([
        {"id":1,"name":"wayne"},
        {"id":1,"name":"john"}
      ]);
    }));

    var dispatcher = this.dispatcher = new Dispatcher();
    this.spy = sinon.spy(dispatcher,"dispatch");
    ActionCreator.setUp(dispatcher);
  });

  // Before each test, re-initialize the dispatcher.
  beforeEach(function(){
    this.spy.reset();
  });

  it("should initialize without candidates",function(done){
    var spy = this.spy;

    // setUp
    var expected = [
      {actionType:'initialize'},
      {actionType:'refresh',candidates:[
        {"id":1,"name":"wayne"},
        {"id":1,"name":"john"}
      ]}
    ];

    ActionCreator.initialize().then(function(){
      Assert.ok(spy.calledTwice);
      Assert.deepEqual(spy.getCall(0).args[0],expected[0]);
      Assert.deepEqual(spy.getCall(1).args[0],expected[1]);
      done();
    }).catch(function(error){
      done(error);
    });
  });
  it("should initialize with candidates",function(){
    var spy = this.spy;

    // setUp
    var expected = [
      {actionType:'initialize',candidates:[]},
      {actionType:'initialize',candidates:[
        {"id":1,"name":"wayne"},
        {"id":1,"name":"john"}
      ]}
    ];

    ActionCreator.initialize([]);
    ActionCreator.initialize([{"id":1,"name":"wayne"},{"id":1,"name":"john"}]);
    Assert.ok(spy.calledTwice);
    Assert.deepEqual(this.spy.getCall(0).args[0],expected[0]);
    Assert.deepEqual(this.spy.getCall(1).args[0],expected[1]);
  });

  it("should trigger refresh",function(done){
    var spy = this.spy;

    // setUp
    var expected = {actionType:'refresh',candidates:[
      {"id":1,"name":"wayne"},
      {"id":1,"name":"john"}
    ]};

    ActionCreator.refresh().then(function(){
      Assert.ok(spy.calledOnce);
      Assert.deepEqual(spy.getCall(0).args[0],expected);
      done();
    }).catch(function(error){
      done(error);
    });
  });
});
