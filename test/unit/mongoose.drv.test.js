/**
 * @fileOverview Testing the Entity driver for mongoose.
 */

// var sinon  = require('sinon');
var chai = require('chai');
var sinon = require('sinon');
var assert = chai.assert;

// module to test
var Entity = require('../../drivers/mongoose.drv');

// libs
var mongoStub = require('../lib/mongoose-stub');
var fix = require('../fixture/data.fix');

// var noop = function(){};

suite('2. Mongoose Driver', function() {

  setup(function(done) {
    mongoStub.connect(done);
  });
  teardown(function() {});


  // The numbering (e.g. 1.1.1) has nothing to do with order
  // The purpose is to provide a unique string so specific tests are
  // run by using the mocha --grep "1.1.1" option.

  suite('2.1 Surface Tests', function() {
    var ent;
    setup(function() {
      ent = new Entity();
    });
    test('2.1.1 Primitive Methods', function(){
      assert.isFunction(ent.create, 'Entity should have a "create" method');
      assert.isFunction(ent.read, 'Entity should have a "read" method');
      assert.isFunction(ent.readOne, 'Entity should have a "readOne" method');
      assert.isFunction(ent.readLimit, 'Entity should have a "readLimit" method');
      assert.isFunction(ent.update, 'Entity should have a "update" method');
      assert.isFunction(ent.delete, 'Entity should have a "delete" method');
      assert.isFunction(ent.count, 'Entity should have a "count" method');
    });
    test('2.1.2 Helper Methods', function(){
      assert.isFunction(ent.setUdo, 'Entity should have a "setUdo" method');
    });
    test('2.1.3 Primitive Methods middleware "use" method', function(){
      assert.isFunction(ent.create.use, 'Entity should have a "create.use" method');
      assert.isFunction(ent.read.use, 'Entity should have a "read.use" method');
      assert.isFunction(ent.readOne.use, 'Entity should have a "readOne.use" method');
      assert.isFunction(ent.readLimit.use, 'Entity should have a "readLimit.use" method');
      assert.isFunction(ent.update.use, 'Entity should have a "update.use" method');
      assert.isFunction(ent.delete.use, 'Entity should have a "delete.use" method');
      assert.isFunction(ent.count.use, 'Entity should have a "count.use" method');
    });
  });
});
