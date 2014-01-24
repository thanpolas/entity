/**
 * @fileOverview Testing the Entity Middleware and "before", "after" methods.
 */

var sinon  = require('sinon');
var chai = require('chai');
// var sinon = require('sinon');
var assert = chai.assert;

var Entity = require('../../');

var noop = function(){};

setup(function() {});
teardown(function() {});


// The numbering (e.g. 1.1.1) has nothing to do with order
// The purpose is to provide a unique string so specific tests are
// run by using the mocha --grep "1.1.1" option.

suite('4.11 Entity Middleware and "before", "after" methods', function() {
  test('4.11.1 surface tests', function() {
    var entityOne = Entity.extend(function() {
      this.method('create', this._create.bind(this));
    });

    entityOne.prototype._create = noop;

    var ent = entityOne();

    assert.isFunction(ent.create, 'a "create" method should exist');
    assert.isFunction(ent.create.use, 'a "create.use" method should exist');
    assert.isFunction(ent.create.before, 'a "create.before" method should exist');
    assert.isFunction(ent.create.after, 'a "create.after" method should exist');
  });

  test('4.11.1 Proper sequence of execution', function() {
    var stubBeforeOne = sinon.stub();
    var stubBeforeTwo = sinon.stub();
    var stubAfterOne = sinon.stub();
    var stubAfterTwo = sinon.stub();
    var stubActual = sinon.stub();

    var entityOne = Entity.extend(function() {
      this.method('create', this._create.bind(this));

      this.create.before(stubBeforeOne);
      this.create.before(stubBeforeTwo);
      this.create.after(stubAfterOne);
      this.create.after(stubAfterTwo);
    });

    entityOne.prototype._create = stubActual;

    entityOne().create();

    assert(stubBeforeOne.calledBefore(stubBeforeTwo), 'stubABeforeOne() before stubBeforeTwo()');
    assert(stubBeforeTwo.calledBefore(stubActual), 'stubBeforeTwo() before stubActual()');
    assert(stubActual.calledBefore(stubAfterOne), 'stubActual() before stubAfterOne()');
    assert(stubAfterOne.calledBefore(stubAfterTwo), 'stubAfterOne() before stubAfterTwo()');
  });
});
