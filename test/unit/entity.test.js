/**
 * @fileOverview Testing the Entity interface.
 */

// var sinon  = require('sinon');
var chai = require('chai');
// var sinon = require('sinon');
var assert = chai.assert;

var Entity = require('../../');


// var noop = function(){};

setup(function() {});
teardown(function() {});


// The numbering (e.g. 1.1.1) has nothing to do with order
// The purpose is to provide a unique string so specific tests are
// run by using the mocha --grep "1.1.1" option.

suite('1.1 API Surface', function() {
  test('1.1.1 Core Methods', function() {
    assert.isFunction(Entity, 'Entity core is a "constructor"');
    assert.isFunction(Entity.extend, 'Entity should have an "extend" static method');
    assert.notProperty(Entity, 'getInstance', 'Entity should not have a "getInstance" static method');
    assert.notProperty(Entity, 'mixin', 'Entity should not have a "mixin" static method');
    assert.notProperty(Entity, 'prototype', 'Entity core should not have a "prototype"');
    assert.notProperty(Entity, 'method', 'Entity core should not have a "method" static method');
  });
});
