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
    var EntityOne = Entity.extend(function() {
      this.method('create', this._create.bind(this));
    });

    EntityOne.prototype._create = noop;

    var entityOne = new EntityOne();

    assert.isFunction(entityOne.create, 'a "create" method should exist');
    assert.isFunction(entityOne.create.use, 'a "create.use" method should exist');
    assert.isFunction(entityOne.create.before, 'a "create.before" method should exist');
    assert.isFunction(entityOne.create.after, 'a "create.after" method should exist');
  });

  test('4.11.1 Proper sequence of execution', function() {
    var stubUseOne = sinon.stub().yields();
    var stubUseTwo = sinon.stub().yields();
    var stubBeforeOne = sinon.stub().yields();
    var stubBeforeTwo = sinon.stub().yields();
    var stubAfterOne = sinon.stub().yields();
    var stubAfterTwo = sinon.stub().yields();
    var stubActual = sinon.stub().yields();

    var EntityOne = Entity.extend(function() {
      this.method('create', this._create.bind(this));

      this.create.before(stubBeforeOne);
      this.create.before(stubBeforeTwo);
      this.create.use(stubUseOne);
      this.create.use(stubUseTwo);
      this.create.after(stubAfterOne);
      this.create.after(stubAfterTwo);
    });

    EntityOne.prototype._create = stubActual;

    var entityOne = new EntityOne();

    entityOne.create();

    assert(stubBeforeOne.calledBefore(stubBeforeTwo), 'stubABeforeOne() before stubBeforeTwo()');
    assert(stubBeforeTwo.calledBefore(stubUseOne), 'stubBeforeTwo() before stubUseOne()');
    assert(stubUseOne.calledBefore(stubUseTwo), 'stubUseOne() before stubUseTwo()');
    assert(stubUseTwo.calledBefore(stubActual), 'stubUseTwo() before stubActual()');
    assert(stubActual.calledBefore(stubAfterOne), 'stubActual() before stubAfterOne()');
    assert(stubAfterOne.calledBefore(stubAfterTwo), 'stubAfterOne() before stubAfterTwo()');
  });
});
