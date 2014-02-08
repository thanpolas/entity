/*jshint unused:false */

/**
 * @fileOverview The Entity base class.
 *
 */

var EventEmitter = require('events').EventEmitter;
var util = require('util');

var inher = require('inher');
var midd = require('middlewarify');

var IeventEmitter = inher.wrap(EventEmitter);

/**
 * The base Entity Class all entities extend from.
 *
 * @constructor
 * @extends {events.EventEmitter}
 */
var Entity = module.exports = IeventEmitter.extend(function() {
  /** @type {?mschema} Cached version of Entity's schema */
  this._schema = null;
});

/**
 * Apply middleware and "before", "after" handlers to a method.
 *
 * @param {string} name The name of the method.
 * @param {Function} fn The final callback.
 */
Entity.prototype.method = function(name, fn) {
  midd.make(this, name, fn, {beforeAfter: true});
};

/*
 * A normalized format for fetching the Entity's schema.
 *
 * @return {Object}
 */
Entity.prototype.getSchema = function() {
  throw new Error('Not Implemented');
};
