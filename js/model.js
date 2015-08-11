function Person(param) {
  var name = param.name;

  this.getName = function(){
    return name;
  };
};

function Candidate(param) {
  var skills = param.skills;

  Person.call(this,param);
  this.getSkills = function(){
    return skills;
  };
};
Candidate.prototype = Object.create(Person.prototype);
Candidate.prototype.constructor = Candidate;
