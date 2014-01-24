/**
 * @fileOverview Testing the Entity interface.
 */

// var sinon  = require('sinon');
var chai = require('chai');
// var sinon = require('sinon');
var assert = chai.assert;

// var noop = function(){};

var tests = module.exports = {};

/**
 * Surface test the entity API.
 *
 * @param {Object} driver The driver object as defined in core.test.js
 */
tests.ctorInheritance = function(driver) {
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

    test(majNum + '.0.2 inheritance', function() {
      var invoked = 0;
      var Entity = driver.entity.extend(function(){
        invoked++;
      });

      var entityOne = new Entity();
      var entityTwo = Entity();

      assert.instanceOf(entityOne, Entity, 'Using new keyword');
      assert.instanceOf(entityTwo, Entity, 'Just invoking');
      assert.equal(invoked, 2, 'ctor should be invoked twice');
    });
  });

};


