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
    Entity.extend(done).getInstance();
  });
  test('2.0.1.1 Can extend without a ctor', function(){
    assert.doesNotThrow(Entity.extend);
  });
  test('2.0.2 extend() returns a ctor that its instance is instanceof Entity', function() {
    var entityChild = Entity.extend().getInstance();
    assert.instanceOf(entityChild, Entity);
  });
});

test('2.0.5 prototype methods are inherited', function() {
  var EntityOne = Entity.extend();
  EntityOne.prototype.add = function(a, b) { return a + b; };

  var entityTwo = EntityOne.extend().getInstance();
  assert.isFunction(entityTwo.add);
  assert.equal(2, entityTwo.add(1,1));
});

test('2.0.6 ctor "this" defined properties are inherited', function() {
  var EntityOne = Entity.extend(function(){
    this.a = 1;
  });

  var entityTwo = EntityOne.extend().getInstance;
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
  var entityOne = EntityOne.getInstance();
  entityOne.a = 3;
  entityOne.obj.b = 6;

  var entityTwo = EntityOne.extend().getInstance();
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

  var entityTwo = EntityOne.extend().getInstance();
  assert.notProperty(entityTwo, 'astaticfn');
});
