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
 * Test CRUD methods.
 *
 * @param {Object} driver The driver object as defined in core.test.js
 * @param {string} majNum The Major number.
 */
module.exports = function(driver, majNum) {

  suite(majNum + '.3 Create records', function() {
    var ent;
    setup(function() {
      ent = driver.factory();
    });
    test(majNum + '.3.1 Create a record', function(done) {
      ent.create(fix.one, function(err, data) {
        if (err) {return done(err);}
        assert.notInstanceOf(err, Error, 'Should have no error');
        assert.equal(data.name, fix.one.name, 'Name should be the same');
        assert.equal(data.isActive, fix.one.isActive, 'isActive should be the same');
        done();
      });
    });
  });
};
