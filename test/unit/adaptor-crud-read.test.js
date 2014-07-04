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
 * Test CRUD READ methods.
 *
 * @param {Object} adaptor The adaptor object as defined in core.test.js
 * @param {string} majNum The Major number.
 */
module.exports = function(adaptor, majNum) {

  suite(majNum + '.5 Read records', function() {
    suite(majNum + '.5.2 using ', function() {
      var ent, id;
      setup(function(done) {
        ent = adaptor.factory();
        ent.create(fix.one).then(function(obj) {
          id = obj.id;
          ent.create(fix.two).then(done.bind(null, null), done);
        }).then(null, done);
      });

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

    suite(majNum + '.5.3 sorting ', function() {
      setup(function(done) {
        this.ent = adaptor.factory();
        var self = this;
        this.ent.create(fix.one).then(function(obj) {
          self.id = obj.id;
          self.ent.create(fix.two).then(done.bind(null, null), done);
        }).then(null, done);
      });
      test(majNum + '.5.3.1 Default sorting is ASC', function(done) {
        this.ent.read().then(function(res) {
          assert.equal(res[0].sortby, 1, 'Default sorting is ASC');
        }).then(done, done);
      });
      test(majNum + '.5.3.2 Defining sort, default is ASC', function(done) {
        this.ent.sort('sortby');
        this.ent.read().then(function(res) {
          assert.equal(res[0].sortby, 1, 'Default sorting is ASC');
        }).then(done, done);
      });
      test(majNum + '.5.3.3 Defining ASC sort works', function(done) {
        this.ent.sort('sortby', 'ASC');
        this.ent.read().then(function(res) {
          assert.equal(res[0].sortby, 1, 'ASC sorting works');
        }).then(done, done);
      });
      test(majNum + '.5.3.4 Defining DESC sort works', function(done) {
        this.ent.sort('sortby', 'DESC');
        this.ent.read().then(function(res) {
          assert.equal(res[0].sortby, 2, 'DESC sorting works');
        }).then(done, done);
      });
    });
  });
};
