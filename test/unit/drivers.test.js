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
