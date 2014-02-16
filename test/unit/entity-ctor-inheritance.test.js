/**
 * @fileOverview Testing the Entity interface.
 */

// var sinon  = require('sinon');
var chai = require('chai');
// var sinon = require('sinon');
var assert = chai.assert;

// var noop = function(){};

var Entity = require('../../');

setup(function() {});
teardown(function() {});


// The numbering (e.g. 1.1.1) has nothing to do with order
// The purpose is to provide a unique string so specific tests are
// run by using the mocha --grep "1.1.1" option.

suite('2.0 constructor and inheritance', function() {
  test('2.0.1 Extending with a constructor', function(done) {
    var Child = Entity.extend(done);
    new Child();
  });
  test('2.0.1.1 Can extend without a ctor', function(){
    assert.doesNotThrow(Entity.extend);
  });
  test('2.0.2 extend() returns a ctor that its instance is instanceof Entity', function() {
    var EntityChild = Entity.extend();
    var entityChild = new EntityChild();
    assert.instanceOf(entityChild, Entity);
  });
});

test('2.0.5 prototype methods are inherited', function() {
  var EntityOne = Entity.extend();
  EntityOne.prototype.add = function(a, b) { return a + b; };

  var EntityTwo = EntityOne.extend();
  var entityTwo = new EntityTwo();
  assert.isFunction(entityTwo.add);
  assert.equal(2, entityTwo.add(1,1));
});

test('2.0.6 ctor "this" defined properties are inherited', function() {
  var EntityOne = Entity.extend(function(){
    this.a = 1;
  });
  var EntityTwo = EntityOne.extend();
  var entityTwo = new EntityTwo();
  assert.property(entityTwo, 'a');
  assert.equal(entityTwo.a, 1);
});

test('2.0.7 ctor "this" defined properties have no side-effects', function() {
  var EntityOne = Entity.extend(function(){
    this.a = 1;
    this.obj = {
      b: 2,
    };
  });
  var entityOne = new EntityOne();
  entityOne.a = 3;
  entityOne.obj.b = 6;

  var EntityTwo = EntityOne.extend();
  var entityTwo = new EntityTwo();

  assert.property(entityTwo, 'a');
  assert.property(entityTwo, 'obj');
  assert.equal(entityTwo.a, 1);
  assert.equal(entityTwo.obj.b, 2);

  entityTwo.a = 5;
  entityTwo.obj.b = 9;
  assert.equal(entityOne.a, 3);
  assert.equal(entityOne.obj.b, 6);
});

test('2.0.8 static methods are not inherited', function(){
  var EntityOne = Entity.extend();
  EntityOne.astaticfn = function(){};

  var EntityTwo = EntityOne.extend();
  var entityTwo = new EntityTwo();

  assert.notProperty(entityTwo, 'astaticfn');
});
