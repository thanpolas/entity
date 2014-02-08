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
 * Test CRUD READ methods.
 *
 * @param {Object} driver The driver object as defined in core.test.js
 * @param {string} majNum The Major number.
 */
module.exports = function(driver, majNum) {

  suite(majNum + '.5 Read records', function() {
    var ent, id;
    setup(function(done) {
      ent = driver.factory().getInstance();
      ent.create(fix.one, function(err, obj) {
        if (err) {return done(err);}
        id = obj.id;
        ent.create(fix.two, done);
      });
    });
    suite(majNum + '.5.1 using Callbacks', function() {
      test(majNum + '.5.1.1 Read one record using the id', function(done) {
        ent.readOne(id, function(err, res) {
          assert.equal(res.name, fix.one.name, 'Name should be the same');
          done();
        });
      });
      test(majNum + '.5.1.2 Read one record using custom query', function(done) {
        ent.readOne({name: fix.one.name}, function(err, res) {
          assert.equal(res.name, fix.one.name, 'Name should be the same');
          done();
        });
      });
      test(majNum + '.5.1.3 Read all records', function(done) {
        ent.read(function(err, res) {
          assert.equal(res.length, 2, 'There should be two results');
          assert.equal(res[0].name, fix.one.name, 'Name should be the same');
          done();
        });
      });
      test(majNum + '.5.1.4 Read limited set of records', function(done) {
        ent.readLimit(null, 0, 1, function(err, res) {
          assert.equal(res.length, 1, 'There should be one result');
          assert.equal(res[0].name, fix.one.name, 'Name should be the same');
          done();
        });
      });
    });
    suite(majNum + '.5.2 using ', function() {
      test(majNum + '.5.2.1 Read one record using the id', function(done) {
        ent.readOne(id).then(function(res) {
          assert.equal(res.name, fix.one.name, 'Name should be the same');
        }).then(done, done);
      });
      test(majNum + '.5.2.2 Read one record using custom query', function(done) {
        ent.readOne({name: fix.one.name}).then(function(res) {
          assert.equal(res.name, fix.one.name, 'Name should be the same');
        }).then(done, done);
      });
      test(majNum + '.5.2.3 Read all records', function(done) {
        ent.read().then(function(res) {
          assert.equal(res.length, 2, 'There should be two results');
          assert.equal(res[0].name, fix.one.name, 'Name should be the same');
        }).then(done, done);
      });
      test(majNum + '.5.2.4 Read limited set of records', function(done) {
        ent.readLimit(null, 0, 1).then(function(res) {
          assert.equal(res.length, 1, 'There should be one result');
          assert.equal(res[0].name, fix.one.name, 'Name should be the same');
        }).then(done, done);
      });
    });

  });
};
