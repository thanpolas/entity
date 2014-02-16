/**
 * @fileOverview Testing the adaptors implementation.
 */

// var sinon  = require('sinon');
var chai = require('chai');
// var sinon = require('sinon');
var assert = chai.assert;

var fix = require('../fixture/data.fix');

/**
 * Test CRUD utility methods.
 *
 * @param {Object} adaptor The adaptor object as defined in core.test.js
 * @param {string} majNum The Major number.
 */
module.exports = function(adaptor, majNum) {


  suite(majNum + '.1 CRUD API Surface', function() {
    var ent;
    setup(function() {
      ent = adaptor.factory();
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
      assert.isFunction(ent.setModel, 'Entity should have a "setModel" method');
    });
    test(majNum + '.1.3 CRUD Primitive Methods middleware "before/after" methods', function(){
      assert.isFunction(ent.create.before, 'Entity should have a "create.before" method');
      assert.isFunction(ent.read.before, 'Entity should have a "read.before" method');
      assert.isFunction(ent.readOne.before, 'Entity should have a "readOne.before" method');
      assert.isFunction(ent.readLimit.before, 'Entity should have a "readLimit.before" method');
      assert.isFunction(ent.update.before, 'Entity should have a "update.before" method');
      assert.isFunction(ent.delete.before, 'Entity should have a "delete.before" method');
      assert.isFunction(ent.count.before, 'Entity should have a "count.before" method');
      assert.isFunction(ent.create.after, 'Entity should have a "create.after" method');
      assert.isFunction(ent.read.after, 'Entity should have a "read.after" method');
      assert.isFunction(ent.readOne.after, 'Entity should have a "readOne.after" method');
      assert.isFunction(ent.readLimit.after, 'Entity should have a "readLimit.after" method');
      assert.isFunction(ent.update.after, 'Entity should have a "update.after" method');
      assert.isFunction(ent.delete.after, 'Entity should have a "delete.after" method');
      assert.isFunction(ent.count.after, 'Entity should have a "count.after" method');
    });
  });

  suite(majNum + '.7 Instance integrity', function() {
    var ent;
    setup(function() {
      var Ent = adaptor.Entity.extend();
      ent = new Ent();
    });

    test(majNum + '.7.1 Will throw error if no proper Model provided', function() {
      assert.throws(ent.setModel.bind(ent));
    });

    suite(majNum + '.7.3 Using Promises', function() {
      // to force promises usage, just don't include a noop
      test(majNum + '.7.3.1 Will throw error if CREATE with no Model set', function(done) {
        ent.create(fix.one).then(null, function(err) {
          assert.instanceOf(err, Error);
        }).then(done, done);
      });
      test(majNum + '.7.3.2 Will throw error if READ with no Model set', function(done) {
        ent.read(fix.one.id).then(null, function(err) {
          assert.instanceOf(err, Error);
        }).then(done, done);
      });
      test(majNum + '.7.3.3 Will throw error if UPDATE with no Model set', function(done) {
        ent.update(fix.one.id, {name: 'new val'}).then(null, function(err) {
          assert.instanceOf(err, Error);
        }).then(done, done);
      });
      test(majNum + '.7.3.4 Will throw error if DELETE with no Model set', function(done) {
        ent.delete(fix.one.id).then(null, function(err) {
          assert.instanceOf(err, Error);
        }).then(done, done);
      });
      test(majNum + '.7.3.5 Will throw error if READ-ONE with no Model set', function(done) {
        ent.readOne(fix.one.id).then(null, function(err) {
          assert.instanceOf(err, Error);
        }).then(done, done);
      });
      test(majNum + '.7.3.6 Will throw error if READ-LIMIT with no Model set', function(done) {
        ent.readLimit(null, 0, 1).then(null, function(err) {
          assert.instanceOf(err, Error);
        }).then(done, done);
      });
      test(majNum + '.7.3.7 Will throw error if COUNT with no Model set', function(done) {
        ent.count().then(null, function(err) {
          assert.instanceOf(err, Error);
        }).then(done, done);
      });
    });

  });

  suite(majNum + '.6 Count records', function() {
    var ent, id;
    setup(function(done) {
      ent = adaptor.factory();
      ent.create(fix.one).then(function(obj) {
        id = obj.id;
        ent.create(fix.two).then(done.bind(null, null), done);
      }).then(null, done);
    });
    test(majNum + '.6.2 Count records with promise', function(done) {
      ent.count().then(function(count) {
        assert.equal(count, 2, 'There should be two results');
      }).then(done, done);
    });
  });
};
