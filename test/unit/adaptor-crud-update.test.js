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
 * Test CRUD UPDATE methods.
 *
 * @param {Object} driver The driver object as defined in core.test.js
 * @param {string} majNum The Major number.
 */
module.exports = function(driver, majNum) {

  suite(majNum + '.4 Update records', function() {
    var ent, id;
    setup(function(done) {
      ent = driver.factory().getInstance();
      ent.create(fix.one, function(err, obj) {
        if (err) {return done(err);}
        id = obj.id;
        done();
      });
    });

    suite(majNum + '.4.1 Using Callbacks', function() {
      test(majNum + '.4.1.1 Update a record using the id', function(done) {
        var newVal = 'new value';
        ent.update(id, {name: newVal}, function(err, obj) {
          if (err) {return done(err);}
          assert.equal(obj.name, newVal, 'Name should have been updated on returned object');
          // perform a read
          ent.readOne(id, function(err, res) {
            assert.equal(res.name, newVal, 'Name should have been updated on read');
            done();
          });
        });
      });
      test(majNum + '.4.1.2 Update a record using custom query', function(done) {
        var newVal = 'new value';
        ent.update({name: fix.one.name}, {name: newVal}, function(err, obj) {
          if (err) {return done(err);}
          assert.equal(obj.name, newVal, 'Name should have been updated on returned object');
          // perform a read
          ent.readOne(id, function(err, res) {
            assert.equal(res.name, newVal, 'Name should have been updated on read');
            done();
          });
        });
      });
    });
    suite(majNum + '.4.2 Using Promises', function() {
      test(majNum + '.4.2.1 Update a record using the id', function(done) {
        var newVal = 'new value';
        ent.update(id, {name: newVal}).then(function(obj) {
          assert.equal(obj.name, newVal, 'Name should have been updated on returned object');
          // perform a read
          ent.readOne(id).then(function(res) {
            assert.equal(res.name, newVal, 'Name should have been updated on read');
          }).then(done, done);
        }).then(null, done);
      });
      test(majNum + '.4.2.2 Update a record using custom query', function(done) {
        var newVal = 'new value';
        ent.update({name: fix.one.name}, {name: newVal}).then(function(obj) {
          assert.equal(obj.name, newVal, 'Name should have been updated on returned object');
          // perform a read
          ent.readOne(id).then(function(res) {
            assert.equal(res.name, newVal, 'Name should have been updated on read');
          }).then(done, done);
        }).then(null, done);
      });
    });

  });
};
