/*jshint unused:false */

/**
 * @fileOverview The Entity base class.
 *
 */

var EventEmitter = require('events').EventEmitter;
var util = require('util');

var midd = require('middlewarify');

/**
 * The base Entity Class all entities extend from.
 *
 * @constructor
 * @extends {events.EventEmitter}
 */
var Entity = module.exports = function() {
  EventEmitter.call(this);

  /** @type {mschema?} Cached version of Entity's schema */
  this._schema = null;
};
util.inherits(Entity, EventEmitter);

/**
 * Boilerplate extention of Entity Object.
 *
 * @param {Function} cTor The constructor.
 * @param {Function=} optCtor When the arity of the function is 2 this cTor
 *   is the one that was passed by the invoker, thus is the child constructor.
 * @return {Entity} An entity cTor.
 * @static
 */
Entity.extend = function(cTor, optCtor) {
  var parentCtor;
  var childCtor;

  if (arguments.length === 2) {
    childCtor = optCtor;
    parentCtor = cTor;
  } else {
    childCtor = cTor;
    parentCtor = Entity;
  }

  /** @constructor */
  function TempCtor() {}
  TempCtor.prototype = parentCtor.prototype;
  childCtor.prototype = new TempCtor();

  // override constructor
  childCtor.prototype.constructor = function() {
    parentCtor.apply(this, arguments);
    childCtor.apply(this, arguments);
  };

  childCtor.extend = parentCtor.extend.bind(null, childCtor);

  return childCtor;
};

/**
 * Apply middleware and "before", "after" handlers to a method.
 *
 * @param {string} name The name of the method.
 * @param {Function} fn The final callback.
 */
Entity.prototype.method = function(name, fn) {
  midd.make(this, name, fn);
};


/*
 * A normalized format for fetching the Entity's schema.
 *
 * @return {Object}
 */
Entity.prototype.getSchema = function() {
  throw new Error('Not Implemented');
};
