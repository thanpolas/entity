/**
 * @fileOverview Provide a common interface for drivers.
 */
var __ = require('lodash');
var EntityCrud = require('../entity-crud');

/**
 * Provide a common interface for drivers.
 *
 * @param {Object=} optUdo Optionally define the current handling user.
 * @constructor
 * @extends {crude.Entity}
 */
var Entity = module.exports = EntityCrud.extend(function(optUdo) {
  /** @type {string} The default 'id' field name */
  this._idName = '_id';
});

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
