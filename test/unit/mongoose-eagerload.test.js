/**
 * @fileOverview Testing Mongoose eagerload methods.
 */
var __ = require('lodash');
var Promise = require('bluebird');
// var sinon  = require('sinon');
var chai = require('chai');
var expect = chai.expect;
// var sinon = require('sinon');
// var assert = chai.assert;

var fix = require('../fixture/data.fix');
var Entity = require('../..');
var mongStub = require('../lib/mongoose-stub');

suite.only('Mongoose Eager Load Methods', function() {
  setup(mongStub.connect);
  setup(mongStub.nukedb);

  setup(function() {
    var EntMong = Entity.Mongoose.extend();
    this.entity = new EntMong();
    this.entity.setModel(mongStub.Model);

    var EntRelMong = Entity.Mongoose.extend();
    this.entityRel = new EntRelMong();
    this.entityRel.setModel(mongStub.ModelRel);
    this.entityRel.eagerLoad('parent');
  });
  setup(function() {
    return Promise.all([
      this.entity.create(fix.one),
      this.entity.create(fix.two),
    ])
      .bind(this)
      .then(function(res) {
        this.recordOne = res[0];
        this.recordTwo = res[1];
      });
  });
  setup(function() {
    var fixOne = __.clone(fix.relOne);
    var fixTwo = __.clone(fix.relTwo);
    fixOne.parent = this.recordOne._id;
    fixTwo.parent = this.recordTwo._id;

    return Promise.all([
      this.entityRel.create(fixOne),
      this.entityRel.create(fixTwo),
    ])
      .bind(this)
      .then(function(res) {
        this.recordRelOne = res[0];
        this.recordRelTwo = res[1];
      });
  });

  teardown(function() {
    return Promise.all([
      this.entity.delete(),
      this.entityRel.delete(),
    ]);
  });

  suite('Normal Operation', function() {
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
});
