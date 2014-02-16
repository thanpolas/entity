/**
 * @fileOverview Testing the Entity CRUD interface.
 */

// var sinon  = require('sinon');
var chai = require('chai');
// var sinon = require('sinon');
var assert = chai.assert;

var CrudIface = require('../../').CrudIface;

setup(function() {});
teardown(function() {});

// The numbering (e.g. 1.1.1) has nothing to do with order
// The purpose is to provide a unique string so specific tests are
// run by using the mocha --grep "1.1.1" option.

suite('9.2 CRUD Raw Interface', function() {
  var entity = new CrudIface();
  test('9.2.1 CRUD Primitive methods', function(){
    assert.isFunction(entity.create, 'method: create');
    assert.isFunction(entity.read, 'method: read');
    assert.isFunction(entity.readOne, 'method: readOne');
    assert.isFunction(entity.readLimit, 'method: readLimit');
    assert.isFunction(entity.update, 'method: update');
    assert.isFunction(entity.delete, 'method: delete');
    assert.isFunction(entity.count, 'method: count');
    assert.isFunction(entity.setModel, 'method: setModel');
  });
});
