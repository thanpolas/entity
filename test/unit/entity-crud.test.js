/**
 * @fileOverview Testing the Entity CRUD interface.
 */

// var sinon  = require('sinon');
var chai = require('chai');
// var sinon = require('sinon');
var assert = chai.assert;

var entity = require('../../');

setup(function() {});
teardown(function() {});

// The numbering (e.g. 1.1.1) has nothing to do with order
// The purpose is to provide a unique string so specific tests are
// run by using the mocha --grep "1.1.1" option.

suite('9.2 CRUD Raw Interface', function() {
  test('9.2.1 CRUD Primitive methods are not implemented', function(){
    assert.throws(entity.create, Error, 'Not Implemented', 'method: create');
    assert.throws(entity.read, Error, 'Not Implemented', 'method: read');
    assert.throws(entity.readOne, Error, 'Not Implemented', 'method: readOne');
    assert.throws(entity.readLimit, Error, 'Not Implemented', 'method: readLimit');
    assert.throws(entity.update, Error, 'Not Implemented', 'method: update');
    assert.throws(entity.delete, Error, 'Not Implemented', 'method: delete');
    assert.throws(entity.count, Error, 'Not Implemented', 'method: count');
    assert.throws(entity.setModel, Error, 'Not Implemented', 'method: setModel');
  });
});
