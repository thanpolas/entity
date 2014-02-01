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

  /** @type {?mschema} Cached version of Entity's schema */
  this._schema = null;
};
util.inherits(Entity, EventEmitter);

/**
 * Boilerplate extention of Entity Object.
 *
 * @param {Function} cTor The constructor.
 * @param {Function=} optCtor When the arity of the function is 2 this cTor
 *   is the one that was passed by the invoker, thus is the child constructor.
 * @return {Entity} An entity Instance.
 * @static
 */
Entity.extend = function(cTor, optCtor) {
  var ParentCtor;
  var ChildCtor;

  if (arguments.length === 2) {
    ChildCtor = optCtor;
    ParentCtor = cTor;
  } else {
    ChildCtor = cTor;
    ParentCtor = Entity;
  }

  if (typeof ChildCtor !== 'function') {
    throw new TypeError('Child needs a constructor');
  }
  if (typeof ParentCtor !== 'function') {
    throw new TypeError('Parent needs a constructor');
  }

  /** @constructor */
  function TempCtor() {}
  TempCtor.prototype = ParentCtor.prototype;
  ChildCtor.prototype = new TempCtor();

  // override constructor
  ChildCtor.prototype.constructor = function() {
    ParentCtor.apply(this, arguments);
    ChildCtor.apply(this, arguments);
  };

  // create singleton
  var singleton = new ChildCtor();

  // partially apply extend to singleton instance
  singleton.extend = ParentCtor.extend.bind(null, ChildCtor);

  // reference prototype
  singleton.prototype = ChildCtor.prototype;

  return singleton;
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
