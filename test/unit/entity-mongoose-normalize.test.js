/**
 * @fileOverview Testing Mongoose normalize methods.
 */
var __ = require('lodash');
var Promise = require('bluebird');
// var sinon  = require('sinon');
var chai = require('chai');
var expect = chai.expect;
// var sinon = require('sinon');
var assert = chai.assert;

var fix = require('../fixture/data.fix');
var mongStub = require('../lib/mongoose-stub');

suite('Mongoose Normalization Methods', function() {
  setup(mongStub.connect);
  setup(mongStub.nukedb);

  mongStub.setupRecords();

  suite('Normal Operation', function() {
    test('Should normalize results', function() {
      this.entity.read.after(this.entity.normalize);

      return this.entity.read()
        .bind(this)
        .then(function(res) {
          expect(res[0]).to.have.keys([
            'id',
            'name',
            'sortby',
            '_isActive',
          ]);
        });
    });

    test('Should handle an already normalized set of items', function() {
      this.entity.read.after(this.entity.normalize);

      return this.entity.read()
        .bind(this)
        .then(function(res) {
          var sanres = this.entity.mongooseNormalize.normalize(res);

          expect(sanres[0]).to.have.keys([
            'id',
            'name',
            'sortby',
            '_isActive',
          ]);
        });
    });

    test('Should handle empty results', function() {
      this.entity.read.after(this.entity.normalize);

      return this.entity.read({name: 'none'})
        .bind(this)
        .then(function(res) {
          assert.isArray(res, 'Result should be an array');
          assert.lengthOf(res, 0, 'Should have zero results');
        });
    });

    test('Should normalize single item reads', function() {
      this.entity.readOne.after(this.entity.normalize);

      return this.entity.readOne({name: fix.one.name})
        .bind(this)
        .then(function(res) {
          expect(res).to.have.keys([
            'id',
            'name',
            'sortby',
            '_isActive',
          ]);
        });
    });

    test('Should handle an already normalized single object', function() {
      this.entity.readOne.after(this.entity.normalize);

      return this.entity.readOne({name: fix.one.name})
        .bind(this)
        .then(function(res) {
          var sanres = this.entity.mongooseNormalize.normalize(res);

          expect(sanres).to.have.keys([
            'id',
            'name',
            'sortby',
            '_isActive',
          ]);
        });
    });

    test('Should handle no results for single item reads', function() {
      this.entity.readOne.after(this.entity.normalize);

      return this.entity.readOne({name: 'none'})
        .bind(this)
        .then(function(res) {
          assert.isNull(res, 'Result should be a null');
        });
    });

    test('Should normalize create op', function() {
      this.entity.create.after(this.entity.normalize);

      return this.entity.create(fix.one)
        .bind(this)
        .then(function(res) {
          expect(res).to.have.keys([
            'id',
            'name',
            'sortby',
            '_isActive',
          ]);
        });
    });
    test('Should normalize update op', function() {
      this.entity.update.after(this.entity.normalize);

      return this.entity.update({name: fix.one.name}, {name: fix.one.name})
        .bind(this)
        .then(function(res) {
          expect(res).to.have.keys([
            'id',
            'name',
            'sortby',
            '_isActive',
          ]);
        });
    });
    test('Should normalize read limit', function() {
      this.entity.readLimit.after(this.entity.normalize);

      return this.entity.readLimit(null, 0, 10)
        .bind(this)
        .then(function(res) {
          expect(res[0]).to.have.keys([
            'id',
            'name',
            'sortby',
            '_isActive',
          ]);
        });
    });
  });
  suite('Middleware', function() {
    test('Should return expected result', function() {
      this.entity.readLimit.after(this.entity.normalize);

      this.entity.readLimit.after(function(query, offset, limit, items) {
        return items.map(function(item) {
          item.lol = 1;
          return item;
        });
      });

      return this.entity.readLimit(null, 0, 10)
        .bind(this)
        .then(function(res) {
          expect(res[0]).to.have.keys([
            'id',
            'name',
            'sortby',
            '_isActive',
            'lol',
          ]);
        });
    });
  });


  suite('Relations', function() {
    test('Should normalize single item reads', function() {
      this.entityRel.readOne.after(this.entityRel.normalize);

      return this.entityRel.readOne({darname: fix.relOne.darname})
        .bind(this)
        .then(function(res) {
          expect(res.parent).to.have.keys([
            'id',
            'name',
            'sortby',
            '_isActive',
          ]);
        });
    });

    test('Should handle an already normalized single object', function() {
      this.entityRel.readOne.after(this.entityRel.normalize);

      return this.entityRel.readOne({darname: fix.relOne.darname})
        .bind(this)
        .then(function(res) {
          var sanres = this.entityRel.mongooseNormalize.normalize(res);

          expect(sanres.parent).to.have.keys([
            'id',
            'name',
            'sortby',
            '_isActive',
          ]);
        });
    });

    test('Should handle no results for single item reads', function() {
      this.entityRel.readOne.after(this.entityRel.normalize);

      return this.entityRel.readOne({darname: 'none'})
        .bind(this)
        .then(function(res) {
          assert.isNull(res, 'Result should be a null');
        });
    });

    test('Should normalize create op', function() {
      this.entityRel.create.after(this.entityRel.normalize);
      var fixThree = __.clone(fix.relThree);
      fixThree.parent = this.recordTwo._id;

      return this.entityRel.create(fixThree)
        .bind(this)
        .then(function(res) {
          expect(res.parent).to.have.keys([
            'id',
            'name',
            'sortby',
            '_isActive',
          ]);
        });
    });
    test('Should normalize update op', function() {
      this.entityRel.update.after(this.entityRel.normalize);

      return this.entityRel.update({darname: fix.relOne.darname},
        {darname: fix.relOne.darname})
        .bind(this)
        .then(function(res) {
          expect(res.parent).to.have.keys([
            'id',
            'name',
            'sortby',
            '_isActive',
          ]);
        });
    });
    test('Should normalize read limit', function() {
      this.entityRel.readLimit.after(this.entityRel.normalize);

      return this.entityRel.readLimit(null, 0, 10)
        .bind(this)
        .then(function(res) {
          expect(res[0].parent).to.have.keys([
            'id',
            'name',
            'sortby',
            '_isActive',
          ]);
        });
    });
    test('Should normalize read', function() {
      this.entityRel.read.after(this.entityRel.normalize);

      return this.entityRel.read()
        .bind(this)
        .then(function(res) {
          expect(res[0].parent).to.have.keys([
            'id',
            'name',
            'sortby',
            '_isActive',
          ]);
        });
    });
  });

  suite('Relations Multy', function() {
    test('Should normalize single item reads', function() {
      this.entityRelMult.readOne.after(this.entityRelMult.normalize);

      return this.entityRelMult.readOne({darname: fix.relOne.darname})
        .bind(this)
        .then(function(res) {
          expect(res.parents).to.be.an('array');
          expect(res.parents[0]).to.have.keys([
            'id',
            'name',
            'sortby',
            '_isActive',
          ]);
        });
    });

    test('Should handle an already normalized single object', function() {
      this.entityRelMult.readOne.after(this.entityRelMult.normalize);

      return this.entityRelMult.readOne({darname: fix.relOne.darname})
        .bind(this)
        .then(function(res) {
          var sanres = this.entityRelMult.mongooseNormalize.normalize(res);
          expect(sanres.parents).to.be.an('array');
          expect(sanres.parents[0]).to.have.keys([
            'id',
            'name',
            'sortby',
            '_isActive',
          ]);
        });
    });

    test('Should handle no results for single item reads', function() {
      this.entityRelMult.readOne.after(this.entityRelMult.normalize);

      return this.entityRelMult.readOne({darname: 'none'})
        .bind(this)
        .then(function(res) {
          assert.isNull(res, 'Result should be a null');
        });
    });

    test('Should normalize create op', function() {
      this.entityRelMult.create.after(this.entityRelMult.normalize);
      var fixThree = __.clone(fix.relThree);
      fixThree.parents = [this.recordTwo._id];

      return this.entityRelMult.create(fixThree)
        .bind(this)
        .then(function(res) {
          expect(res.parents).to.be.an('array');
          expect(res.parents[0]).to.have.keys([
            'id',
            'name',
            'sortby',
            '_isActive',
          ]);
        });
    });
    test('Should normalize update op', function() {
      this.entityRelMult.update.after(this.entityRelMult.normalize);

      return this.entityRelMult.update({darname: fix.relOne.darname},
        {darname: fix.relOne.darname})
        .bind(this)
        .then(function(res) {
          expect(res.parents).to.be.an('array');
          expect(res.parents[0]).to.have.keys([
            'id',
            'name',
            'sortby',
            '_isActive',
          ]);
        });
    });
    test('Should normalize read limit', function() {
      this.entityRelMult.readLimit.after(this.entityRelMult.normalize);

      return this.entityRelMult.readLimit(null, 0, 10)
        .bind(this)
        .then(function(res) {
          expect(res[0].parents).to.be.an('array');
          expect(res[0].parents[0]).to.have.keys([
            'id',
            'name',
            'sortby',
            '_isActive',
          ]);
        });
    });
    test('Should normalize read', function() {
      this.entityRelMult.read.after(this.entityRelMult.normalize);

      return this.entityRelMult.read()
        .bind(this)
        .then(function(res) {
          expect(res[0].parents).to.be.an('array');
          expect(res[0].parents[0]).to.have.keys([
            'id',
            'name',
            'sortby',
            '_isActive',
          ]);
        });
    });
  });
});
