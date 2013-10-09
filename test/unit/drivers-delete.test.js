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
 * Test CRUD DELETE methods.
 *
 * @param {Object} driver The driver object as defined in core.test.js
 * @param {string} majNum The Major number.
 */
module.exports = function(driver, majNum) {
  suite(majNum + '.8 DELETE records', function() {
    var ent, id;
    setup(function(done) {
      ent = driver.factory();
      ent.create(fix.one, function(err, obj) {
        if (err) {return done(err);}
        id = obj.id;
        done();
      });
    });

    test(majNum + '.8.1 Delete a record using the id', function(done) {
      ent.delete(id, function(err) {
        if (err) {return done(err);}
        ent.count(null, function(err, count) {
          assert.equal(count, 0, 'no records should exist');
          done();
        });
      });
    });
    test(majNum + '.8.2 Delete a record using custom query', function(done) {
      ent.delete({name: fix.one.name}, function(err) {
        if (err) {return done(err);}
        ent.readOne(id, function(err, res) {
          assert.isNull(res, 'no record should exist');
          done();
        });
      });
    });
  });
};
