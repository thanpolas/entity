/**
 * @fileOverview Testing the Entity CRUD interface.
 */

// var sinon  = require('sinon');
var chai = require('chai');
// var sinon = require('sinon');
var assert = chai.assert;

var entity = require('../../');


// var noop = function(){};

setup(function() {});
teardown(function() {});


// The numbering (e.g. 1.1.1) has nothing to do with order
// The purpose is to provide a unique string so specific tests are
// run by using the mocha --grep "1.1.1" option.

suite('5.2 CRUD Raw Interface', function() {
  var ent;
  setup(function() {
    ent = entity();
  });
  test('5.2.1 CRUD Primitive methods are not implemented', function(){

    assert.throws(ent.create, Error, 'Not Implemented');
    assert.throws(ent.read, Error, 'Not Implemented');
    assert.throws(ent.readOne, Error, 'Not Implemented');
    assert.throws(ent.readLimit, Error, 'Not Implemented');
    assert.throws(ent.update, Error, 'Not Implemented');
    assert.throws(ent.delete, Error, 'Not Implemented');
    assert.throws(ent.count, Error, 'Not Implemented');
  });
});
