/**
 * @fileOverview Testing the drivers implementation.
 */

// var sinon  = require('sinon');
var chai = require('chai');
// var sinon = require('sinon');
var assert = chai.assert;

var fix = require('../fixture/data.fix');

// var noop = function(){};

/**
 * Test CRUD utility methods.
 *
 * @param {Object} driver The driver object as defined in core.test.js
 * @param {string} majNum The Major number.
 */
module.exports = function(driver, majNum) {


  suite(majNum + '.1 CRUD API Surface', function() {
    var ent;
    setup(function() {
      ent = driver.factory();
    });
    test(majNum + '.1.1 CRUD Primitive Methods', function(){
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
    test(majNum + '.1.3 CRUD Primitive Methods middleware "use" method', function(){
      assert.isFunction(ent.create.use, 'Entity should have a "create.use" method');
      assert.isFunction(ent.read.use, 'Entity should have a "read.use" method');
      assert.isFunction(ent.readOne.use, 'Entity should have a "readOne.use" method');
      assert.isFunction(ent.readLimit.use, 'Entity should have a "readLimit.use" method');
      assert.isFunction(ent.update.use, 'Entity should have a "update.use" method');
      assert.isFunction(ent.delete.use, 'Entity should have a "delete.use" method');
      assert.isFunction(ent.count.use, 'Entity should have a "count.use" method');
    });
  });

  suite(majNum + '.7 Instance integrity', function() {
    test(majNum + '.7.1 Will throw error if not proper Model provided', function() {
      function factory() {
        // an Object literal is an invalid Model
        return new driver.Entity({});
      }

      assert.throws(factory, TypeError);
    });
  });

  suite(majNum + '.6 Count records', function() {
    var ent, id;
    setup(function(done) {
      ent = driver.factory();
      ent.create(fix.one, function(err, obj) {
        if (err) {return done(err);}
        id = obj.id;

        ent.create(fix.two, done);
      });
    });
    test(majNum + '.6.1 Count records', function(done) {
      ent.count(null, function(err, count) {
        assert.equal(count, 2, 'There should be two results');
        done();
      });
    });
  });
};
