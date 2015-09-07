/**
 * @fileOverview Test the Mongoose 'and' operator.
 */
// var __ = require('lodash');
// var Promise = require('bluebird');
// var sinon  = require('sinon');
var chai = require('chai');
var expect = chai.expect;
// var sinon = require('sinon');
// var assert = chai.assert;

var fix = require('../fixture/data.fix');
var mongStub = require('../lib/mongoose-stub');

suite('Mongoose "and" operator', function() {
  setup(mongStub.connect);
  setup(mongStub.nukedb);

  mongStub.setupRecords();

  suite('Expected behaviors', function() {
    test('Should fetch expected records', function() {

      return this.entityRelMult.read({
        parents: {and: [
          this.recordOne._id,
          this.recordTwo._id,
        ]},
      })
        .bind(this)
        .then(function(res) {
          expect(res).to.have.length(1);
          expect(res[0].darname).to.equal(fix.relOne.darname);
        });
    });
  });
});
