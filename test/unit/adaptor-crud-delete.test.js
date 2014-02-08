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
 * Test CRUD DELETE methods.
 *
 * @param {Object} adaptor The adaptor object as defined in core.test.js
 * @param {string} majNum The Major number.
 */
module.exports = function(adaptor, majNum) {
  suite(majNum + '.8 DELETE records', function() {
    var ent, id;
    setup(function(done) {
      ent = adaptor.factory();
      ent.create(fix.one, function(err, obj) {
        if (err) {return done(err);}
        id = obj.id;
        done();
      });
    });
    suite(majNum + '.8.1 Using callbacks', function() {
      test(majNum + '.8.1.1 Delete a record using the id', function(done) {
        ent.delete(id, function(err) {
          if (err) {return done(err);}
          ent.count(null, function(err, count) {
            if (err) {return done(err);}
            assert.equal(count, 0, 'no records should exist');
            done();
          });
        });
      });
      test(majNum + '.8.1.2 Delete a record using custom query', function(done) {
        ent.delete({name: fix.one.name}, function(err) {
          if (err) {return done(err);}
          ent.readOne(id, function(err, res) {
            if (err) {return done(err);}
            assert.isNull(res, 'no record should exist');
            done();
          });
        });
      });
    });
    suite(majNum + '.8.2 Using Promises', function() {
      test(majNum + '.8.2.1 Delete a record using the id', function(done) {
        ent.delete(id).then(function() {
          ent.count().then(function(count) {
            assert.equal(count, 0, 'no records should exist');
          }).then(done, done);
        }).then(null, done);
      });
      test(majNum + '.8.2.2 Delete a record using custom query', function(done) {
        ent.delete({name: fix.one.name}).then(function() {
          ent.readOne(id).then(function(res) {
            assert.isNull(res, 'no record should exist');
          }).then(done, done);
        }).then(null, done);
      });
    });
  });
};
