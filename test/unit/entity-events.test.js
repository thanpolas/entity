/**
 * @fileOverview Testing the Entity events.
 */

var EventEmitter = require('events').EventEmitter;

// var sinon  = require('sinon');
var chai = require('chai');
// var sinon = require('sinon');
var assert = chai.assert;

// var noop = function(){};

var Entity = require('../../');

setup(function() {});
teardown(function() {});


// The numbering (e.g. 1.1.1) has nothing to do with order
// The purpose is to provide a unique string so specific tests are
// run by using the mocha --grep "1.1.1" option.

suite('3.10 Events', function() {
  test('3.10.1 Entities are an instance of "events.EventEmitter"', function() {
    var Child = Entity.extend();
    var instance = new Child();

    assert.instanceOf(instance, EventEmitter);
  });
});
