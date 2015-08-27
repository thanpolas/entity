/**
 * @fileOverview Testing Mongoose eagerload methods.
 */
var __ = require('lodash');
// var sinon  = require('sinon');
var chai = require('chai');
var expect = chai.expect;
// var sinon = require('sinon');
// var assert = chai.assert;

var fix = require('../fixture/data.fix');
var mongStub = require('../lib/mongoose-stub');

suite('Mongoose Eager Load Methods', function() {
  setup(mongStub.connect);
  setup(mongStub.nukedb);

  mongStub.setupRecords();

  suite('Normal Operation - single rel', function() {
    function testParent(item) {
      var itemObj = item.toObject();
      expect(itemObj.parent).to.be.an('object');

      expect(itemObj.parent).to.have.keys([
        '_id',
        '__v',
        'name',
        'sortby',
        '_isActive',
      ]);
    }

    test('Should eagerload on read()', function() {
      return this.entityRel.read()
        .bind(this)
        .then(function(items) {
          items.forEach(testParent);
        });
    });
    test('Should eagerload on readLimit()', function() {
      return this.entityRel.readLimit(0, 10)
        .bind(this)
        .then(function(items) {
          items.forEach(testParent);
        });
    });
    test('Should eagerload on readOne()', function() {
      return this.entityRel.readOne(this.recordRelOne._id)
        .bind(this)
        .then(function(item) {
          testParent(item);
        });
    });
    test('Should eagerload on create()', function() {
      var fixThree = __.clone(fix.relThree);
      fixThree.parent = this.recordTwo._id;

      return this.entityRel.create(fixThree)
        .bind(this)
        .then(function(item) {
          testParent(item);
        });
    });
    test('Should eagerload on update()', function() {
      return this.entityRel.update(this.recordRelOne._id, {darname: fix.relOne.darname})
        .bind(this)
        .then(function(item) {
          testParent(item);
        });
    });
  });

  suite('Normal Operation - multy rel', function() {
    function testParent(item) {
      var itemObj = item.toObject();
      expect(itemObj.parents).to.be.an('array');

      expect(itemObj.parents[0]).to.have.keys([
        '_id',
        '__v',
        'name',
        'sortby',
        '_isActive',
      ]);
    }

    test('Should eagerload on read()', function() {
      return this.entityRelMult.read()
        .bind(this)
        .then(function(items) {
          items.forEach(testParent);
        });
    });
    test('Should eagerload on readLimit()', function() {
      return this.entityRelMult.readLimit(0, 10)
        .bind(this)
        .then(function(items) {
          items.forEach(testParent);
        });
    });
    test('Should eagerload on readOne()', function() {
      return this.entityRelMult.readOne(this.recordRelMultOne._id)
        .bind(this)
        .then(function(item) {
          testParent(item);
        });
    });
    test('Should eagerload on create()', function() {
      var fixThree = __.clone(fix.relThree);
      fixThree.parents = [this.recordTwo._id];

      return this.entityRelMult.create(fixThree)
        .bind(this)
        .then(function(item) {
          testParent(item);
        });
    });
    test('Should eagerload on update()', function() {
      return this.entityRelMult.update(this.recordRelMultOne._id,
        {darname: fix.relOne.darname})
        .bind(this)
        .then(function(item) {
          testParent(item);
        });
    });
  });

});
