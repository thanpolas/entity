/*jshint unused:false */

/**
 * @fileOverview The Entity base class.
 *
 */

var EventEmitter = require('events').EventEmitter;
var util = require('util');

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
 * A normalized format for fetching the Entity's schema.
 *
 * @return {Object}
 */
Entity.prototype.getSchema = function() {
  throw new Error('Not Implemented');
};
