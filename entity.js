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

};
util.inherits(Entity, EventEmitter);
