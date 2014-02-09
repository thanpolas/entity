/**
 * @fileOverview The Entity base class.
 *
 */

var EventEmitter = require('events').EventEmitter;

var __ = require('lodash');
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
  this._schema = Object.create(null);
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
 * @return {mschema}
 */
Entity.prototype.getSchema = function() {
  return this._schema;
};

/**
 * Add to schema
 *
 * @param {mschema|string} schemaKey mschema object or attribute name.
 * @param {mschema|string=} optSchemaVal mschema value or value.
 * @return {self}
 */
Entity.prototype.addSchema = function(schemaKey, optSchemaVal) {
  switch(typeof schemaKey) {
  case 'object':
    __.assign(this._schema, schemaKey);
    break;
  case 'string':
    this._schema[schemaKey] = optSchemaVal;
    break;
  default:
    throw new TypeError('Wrong type of arguments');
  }
  return this;
};

/**
 * Remove from schema
 *
 * @param {string} attribute The attribute to remove.
 * @return {self}
 */
Entity.prototype.remSchema = function(attribute) {
  delete this._schema[attribute];
  return this;
};
