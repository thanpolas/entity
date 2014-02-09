/**
 * @fileOverview The Entity base class.
 *
 */

var EventEmitter = require('events').EventEmitter;

var inher = require('inher');
var midd = require('middlewarify');

var Schema = require('./schema');

var IeventEmitter = inher.wrap(EventEmitter);

/**
 * The base Entity Class all entities extend from.
 *
 * @constructor
 * @extends {events.EventEmitter}
 */
var Entity = module.exports = IeventEmitter.extend(function() {});
Entity.mixin(Schema);

/**
 * Apply middleware and "before", "after" handlers to a method.
 *
 * @param {string} name The name of the method.
 * @param {Function} fn The final callback.
 */
Entity.prototype.method = function(name, fn) {
  midd.make(this, name, fn, {beforeAfter: true});
};
