/**
 * @fileOverview Provide a common interface for drivers.
 */

var util = require('util');

var __ = require('lodash');
var EntityCrud = require('../entity-crud');

/**
 * Provide a common interface for drivers.
 *
 * @param {Object=} optUdo Optionally define the current handling user.
 * @constructor
 * @extends {crude.Entity}
 */
var Entity = module.exports = function(optUdo) {
  EntityCrud.call(this, optUdo);
};
util.inherits(Entity, EntityCrud);

/**
 * Helper to return the query properly formated based on type of id.
 *
 * @param {string|Object} id the item id or query for item.
 * @protected
 */
Entity.prototype._getQuery = function(id) {
  var q = {};
  return (__.isObject(id)) ? id : (q[this._idName] = id, q);
};

/**
 * A normalized format for fetching schemas.
 *
 * @return {Object}
 */
Entity.prototype.getSchema = function() {
  throw new Error('Not Implemented');
};
