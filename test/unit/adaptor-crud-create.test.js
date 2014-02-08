/**
 * @fileOverview Testing the adaptors implementation.
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
 * @param {Object} adaptor The adaptor object as defined in core.test.js
 * @param {string} majNum The Major number.
 */
module.exports = function(adaptor, majNum) {

  suite(majNum + '.3 Create records', function() {
    var ent;
    setup(function() {
      ent = adaptor.factory();
    });

    suite(majNum + '.3.1 Using Callbacks', function() {
      test(majNum + '.3.1.1 Create a record', function(done) {
        ent.create(fix.one, function(err, data) {
          if (err) {return done(err);}
          assert.notInstanceOf(err, Error, 'Should have no error');
          assert.equal(data.name, fix.one.name, 'Name should be the same');
          assert.equal(data._isActive, fix.one._isActive, 'isActive should be the same');
          done();
        });
      });
    });

    suite(majNum + '.3.2 Using Promises', function() {
      test(majNum + '.3.2.1 Create a record', function(done) {
        ent.create(fix.one).then(function(data) {
          assert.equal(data.name, fix.one.name, 'Name should be the same');
          assert.equal(data._isActive, fix.one._isActive, 'isActive should be the same');
          done();
        }, done).then(null, done);
      });
    });

  });
};
