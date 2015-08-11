/**
 * @fileOverview Testing Mongoose normalize methods.
 */
var Promise = require('bluebird');
// var sinon  = require('sinon');
var chai = require('chai');
var expect = chai.expect;
// var sinon = require('sinon');
var assert = chai.assert;

var fix = require('../fixture/data.fix');
var Entity = require('../..');
var mongStub = require('../lib/mongoose-stub');

suite.only('Mongoose Normalization Methods', function() {
  setup(mongStub.connect);
  setup(mongStub.nukedb);

  setup(function() {
    var EntMong = Entity.Mongoose.extend();
    this.entity = new EntMong();
    this.entity.setModel(mongStub.Model);
  });

  suite('Normal Operation', function() {
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
  });
});
