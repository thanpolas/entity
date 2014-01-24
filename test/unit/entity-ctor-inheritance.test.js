/**
 * @fileOverview Testing the Entity interface.
 */

// var sinon  = require('sinon');
var chai = require('chai');
// var sinon = require('sinon');
var assert = chai.assert;

// var noop = function(){};

var entity = require('../../');

setup(function() {});
teardown(function() {});


// The numbering (e.g. 1.1.1) has nothing to do with order
// The purpose is to provide a unique string so specific tests are
// run by using the mocha --grep "1.1.1" option.

suite('2.0 constructor and inheritance', function() {
  test('2.0.1 ctor arguments', function(){
    var entityOne = entity.extend(function(arg1){
      assert.isEqual(arg1, 2, 'Arguments should be passed as is');
      assert.isEqual(arguments.length, 1, 'There should be only one argument');
    });
    entityOne(2);
  });
  test('2.0.1.1 Can extend without a ctor', function(){
    assert.doesNotThrow(entity.extend);
  });
  test('2.0.2 inheritance', function() {
    var invoked = 0;
    var entityParent = entity.extend(function() {
      this.id = invoked++;
    });

    var entityOne = new entityParent();
    var entityTwo = entityParent();

    assert.instanceOf(entityOne, entityParent, 'Using new keyword');
    assert.instanceOf(entityTwo, entityParent, 'Just invoking');
    assert.equal(invoked, 2, 'ctor should be invoked twice');
    assert.equal(entityOne.id, 1, '"id" prop of entityOne should be 1');
    assert.equal(entityTwo.id, 2, '"id" prop of entityTwo should be 2');
  });
});

test('2.0.3 multiple inheritance', function() {
  var entityOne = entity.extend(function(num){
    this.num = num;
  });

  entityOne.prototype.incr = function() {
    this.num++;
  };

  var entityTwo = entityOne.extend(function(num, id) {
    this.id = id;
  });

  var entityThree = entityTwo.extend();

  var one = entityOne(1);
  var two = entityTwo(3, 'two');
  var three = entityThree(6, 'three');

  assert.isEqual(two.num, 3, '"two.num" should have a value');
  assert.isEqual(one.num, 1, '"one.num"');
  assert.isEqual(three.num, 6, '"three.num"');
  assert.isEqual(two.id, 'two', '"two.id"');
  assert.isEqual(three.id, 'three', '"three.id"');
  assert.notProperty(one, 'id', '"one.id"');

  two.incr();

  assert.isEqual(two.num, 4, '"two.num" after .incr()');
  assert.isEqual(three.num, 6, '"three.num" after .incr()');
  assert.isEqual(one.num, 1, '"one.num" after .incr()');
});

test('2.0.4 Static methods', function(){
  var entityOne = entity.extend();
  entityOne.staticMethod = function(){};
  var entityChild = entityOne.extend();
  assert.notProperty(entityChild, 'staticMethod');
});
