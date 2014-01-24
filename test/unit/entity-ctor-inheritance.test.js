/**
 * @fileOverview Testing the Entity interface.
 */

// var sinon  = require('sinon');
var chai = require('chai');
// var sinon = require('sinon');
var assert = chai.assert;

// var noop = function(){};

/**
 * Surface test the entity API.
 *
 * @param {Object} driver The driver object as defined in core.test.js
 */
module.exports = function(driver) {
  var majNum = driver.majNum;
  setup(function() {});
  teardown(function() {});


  // The numbering (e.g. 1.1.1) has nothing to do with order
  // The purpose is to provide a unique string so specific tests are
  // run by using the mocha --grep "1.1.1" option.

  suite(majNum + '.0 constructor and inheritance', function() {
    test(majNum + '.0.1 ctor arguments', function(){
      var entity = driver.entity.extend(function(arg1){
        assert.isEqual(arg1, 2, 'Arguments should be passed as is');
        assert.isEqual(arguments.length, 1, 'There should be only one argument');
      });
      entity(2);
    });
    test(majNum + '.0.1.1 Can extend without a ctor', function(){
      assert.doesNotThrow(driver.entity.extend);
    });
    test(majNum + '.0.2 inheritance', function() {
      var invoked = 0;
      var entity = driver.entity.extend(function() {
        this.id = invoked++;
      });

      var entityOne = new entity();
      var entityTwo = entity();

      assert.instanceOf(entityOne, entity, 'Using new keyword');
      assert.instanceOf(entityTwo, entity, 'Just invoking');
      assert.equal(invoked, 2, 'ctor should be invoked twice');
      assert.equal(entityOne.id, 1, '"id" prop of entityOne should be 1');
      assert.equal(entityTwo.id, 2, '"id" prop of entityTwo should be 2');
    });
  });

  test(majNum + '.0.3 multiple inheritance', function() {
    var entityOne = driver.entity.extend(function(num){
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

  test(majNum + '.0.4 Static methods', function(){
    var entity = driver.entity.extend();
    entity.staticMethod = function(){};
    var entityChild = entity.extend();
    assert.notProperty(entityChild, 'staticMethod');
  });


};


