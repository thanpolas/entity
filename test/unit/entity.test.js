/**
 * @fileOverview Testing the Entity interface.
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

suite('1.1 API Surface', function() {
  test('1.1.1 Core Methods', function() {
    assert.isFunction(entity.constructor, 'Entity core should have a "constructor"');
    assert.isFunction(entity.extend, 'Entity should have an "extend" static method');
    assert.notProperty(entity, 'prototype', 'Entity core should not have a "prototype"');
    assert.notProperty(entity, 'method', 'Entity core should not have a "method" static method');
    assert.notProperty(entity, 'getSchema', 'Entity core should not have a "getSchema" static method');
    assert.notProperty(entity, 'addSchema', 'Entity core should not have a "addSchema" static method');
    assert.notProperty(entity, 'remSchema', 'Entity core should not have a "remSchema" static method');
  });
});
