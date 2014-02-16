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

    var ent = new EntityOne();
    assert.isFunction(ent.create, 'a "create" method should exist');
    assert.notProperty(ent.create, 'use', 'a "create.use" method should not exist');
    assert.isFunction(ent.create.before, 'a "create.before" method should exist');
    assert.isFunction(ent.create.after, 'a "create.after" method should exist');
  });

  test('4.11.2 Proper sequence of execution', function(done) {
    var spyBeforeOne = sinon.spy();
    var spyBeforeTwo = sinon.spy();
    var spyAfterOne = sinon.spy();
    var spyAfterTwo = sinon.spy();
    var spyActual = sinon.spy();

    var EntityOne = Entity.extend(function() {
      this.method('create', this._create.bind(this));

      this.create.before(spyBeforeOne);
      this.create.before(spyBeforeTwo);
      this.create.after(spyAfterOne);
      this.create.after(spyAfterTwo);
    });

    EntityOne.prototype._create = spyActual;

    var one = new EntityOne();
    one.create().then(function(){
      assert(spyBeforeOne.calledBefore(spyBeforeTwo), 'spyABeforeOne() before spyBeforeTwo()');
      assert(spyBeforeTwo.calledBefore(spyActual), 'spyBeforeTwo() before spyActual()');
      assert(spyActual.calledBefore(spyAfterOne), 'spyActual() before spyAfterOne()');
      assert(spyAfterOne.calledBefore(spyAfterTwo), 'spyAfterOne() before spyAfterTwo()');
    }).then(done, done);
  });
});
