/**
 * @fileOverview Testing the Entity interface.
 */

// var sinon  = require('sinon');
var chai = require('chai');
var sinon = require('sinon');
var assert = chai.assert;

// var noop = function(){};

var tests = module.exports = {};

/**
 * Surface test the entity API.
 *
 * @param {Object} driver The driver object as defined in core.test.js
 * @param {string} majNum The Major number.
 */
tests.surface = function(driver, majNum) {

  setup(function() {});
  teardown(function() {});


  // The numbering (e.g. 1.1.1) has nothing to do with order
  // The purpose is to provide a unique string so specific tests are
  // run by using the mocha --grep "1.1.1" option.

  suite(majNum + '.0 constructor and inheritance', function() {
    test(majNum + '.0.1', function(){
      var entity = driver.entity.extend(function(arg1){
        assert.isEqual(arg1, 2, 'Arguments should be passed as is');
        assert.isEqual(arguments.length, 1, 'There should be only one argument');
      });
      entity(2);
    });
  });

  suite(majNum + '.1 API Surface', function() {
    var ent;
    setup(function() {
      ent = driver.factory();
    });
    test(majNum + '.1.1 Primitive Methods', function(){
      assert.isFunction(ent.create, 'Entity should have a "create" method');
      assert.isFunction(ent.read, 'Entity should have a "read" method');
      assert.isFunction(ent.readOne, 'Entity should have a "readOne" method');
      assert.isFunction(ent.readLimit, 'Entity should have a "readLimit" method');
      assert.isFunction(ent.update, 'Entity should have a "update" method');
      assert.isFunction(ent.delete, 'Entity should have a "delete" method');
      assert.isFunction(ent.count, 'Entity should have a "count" method');
    });
    test(majNum + '.1.2 Helper Methods', function(){
      assert.isFunction(ent.setUdo, 'Entity should have a "setUdo" method');
    });
    test(majNum + '.1.3 Primitive Methods middleware "use" method', function(){
      assert.isFunction(ent.create.use, 'Entity should have a "create.use" method');
      assert.isFunction(ent.read.use, 'Entity should have a "read.use" method');
      assert.isFunction(ent.readOne.use, 'Entity should have a "readOne.use" method');
      assert.isFunction(ent.readLimit.use, 'Entity should have a "readLimit.use" method');
      assert.isFunction(ent.update.use, 'Entity should have a "update.use" method');
      assert.isFunction(ent.delete.use, 'Entity should have a "delete.use" method');
      assert.isFunction(ent.count.use, 'Entity should have a "count.use" method');
    });
  });
};


/**
 * Raw Interface test, the primitives.
 *
 * @param {Object} driver The driver object as defined in core.test.js
 * @param {string} majNum The Major number.
 */
tests.iface = function(driver, majNum) {
  suite(majNum + '.2 Raw Interface', function() {
    var ent;
    setup(function() {
      ent = driver.factory();
    });
    test(majNum + '.2.1 Primitive methods are not implemented', function(){

      assert.throws(ent.create, Error, 'Not Implemented');
      assert.throws(ent.read, Error, 'Not Implemented');
      assert.throws(ent.readOne, Error, 'Not Implemented');
      assert.throws(ent.readLimit, Error, 'Not Implemented');
      assert.throws(ent.update, Error, 'Not Implemented');
      assert.throws(ent.delete, Error, 'Not Implemented');
      assert.throws(ent.count, Error, 'Not Implemented');
    });
  });
};
