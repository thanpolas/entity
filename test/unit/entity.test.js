/**
 * @fileOverview Testing the Entity interface.
 */

// var sinon  = require('sinon');
var chai = require('chai');
var sinon = require('sinon');
var assert = chai.assert;

// var noop = function(){};

var tests = module.exports = {};

/**
 * Surface test the entity API.
 *
 * @param {Entity} Entity DI for the entity implementation.
 * @param {string} majNum The Major number.
 */
tests.surface = function(Entity, majNum) {
  suite(majNum + '. Entity Base', function() {

    setup(function() {});
    teardown(function() {});


    // The numbering (e.g. 1.1.1) has nothing to do with order
    // The purpose is to provide a unique string so specific tests are
    // run by using the mocha --grep "1.1.1" option.

    suite(majNum + '.1 API Surface', function() {
      var ent;
      setup(function() {
        ent = new Entity();
      });
      test(majNum + '.1.1 Primitive Methods', function(){
        assert.isFunction(ent.create, 'Entity should have a "create" method');
        assert.isFunction(ent.read, 'Entity should have a "read" method');
        assert.isFunction(ent.readOne, 'Entity should have a "readOne" method');
        assert.isFunction(ent.readLimit, 'Entity should have a "readLimit" method');
        assert.isFunction(ent.update, 'Entity should have a "update" method');
        assert.isFunction(ent.delete, 'Entity should have a "delete" method');
        assert.isFunction(ent.count, 'Entity should have a "count" method');
      });
      test(majNum + '.1.2 Helper Methods', function(){
        assert.isFunction(ent.setUdo, 'Entity should have a "setUdo" method');
      });
      test(majNum + '.1.3 Primitive Methods middleware "use" method', function(){
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
};


/**
 * Raw Interface test, the primitives.
 *
 * @param {Entity} Entity DI for the entity implementation.
 * @param {string} majNum The Major number.
 */
tests.iface = function(Entity, majNum) {
  suite(majNum + '.2 Raw Interface', function() {
    var ent;
    setup(function() {
      ent = new Entity();
    });
    test(majNum + '.2.1 Primitive methods are not implemented', function(){
      var spyCreate = sinon.spy();
      var spyRead = sinon.spy();
      var spyReadOne = sinon.spy();
      var spyReadLimit = sinon.spy();
      var spyUpdate = sinon.spy();
      var spyDelete = sinon.spy();
      var spyCount = sinon.spy();

      ent.create().done(spyCreate);
      ent.read().done(spyRead);
      ent.readOne().done(spyReadOne);
      ent.readLimit().done(spyReadLimit);
      ent.update().done(spyUpdate);
      ent.delete().done(spyDelete);
      ent.count().done(spyCount);

      assert.instanceOf(spyCreate.args[0][0], Error, 'first arg should be instanceOf Error');
      assert.instanceOf(spyRead.args[0][0], Error, 'first arg should be instanceOf Error');
      assert.instanceOf(spyReadOne.args[0][0], Error, 'first arg should be instanceOf Error');
      assert.instanceOf(spyReadLimit.args[0][0], Error, 'first arg should be instanceOf Error');
      assert.instanceOf(spyUpdate.args[0][0], Error, 'first arg should be instanceOf Error');
      assert.instanceOf(spyDelete.args[0][0], Error, 'first arg should be instanceOf Error');
      assert.instanceOf(spyCount.args[0][0], Error, 'first arg should be instanceOf Error');

      var message = 'Not Implemented';
      assert.equal(spyCreate.args[0][0].message, message, 'Error Message of "create" should be "Not Implemented"');
      assert.equal(spyRead.args[0][0].message, message, 'Error Message of "read" should be "Not Implemented"');
      assert.equal(spyReadOne.args[0][0].message, message, 'Error Message of "readOne" should be "Not Implemented"');
      assert.equal(spyReadLimit.args[0][0].message, message, 'Error Message of "readLimit" should be "Not Implemented"');
      assert.equal(spyUpdate.args[0][0].message, message, 'Error Message of "update" should be "Not Implemented"');
      assert.equal(spyDelete.args[0][0].message, message, 'Error Message of "delete" should be "Not Implemented"');
      assert.equal(spyCount.args[0][0].message, message, 'Error Message of "count" should be "Not Implemented"');
    });
  });
};
