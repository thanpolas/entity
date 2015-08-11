/**
 * @fileOverview Provide a common interface for drivers.
 */
var __ = require('lodash');
var EntityCrud = require('../lib/entity-crud');

/**
 * Provide a common interface for drivers.
 *
 * @param {Object=} optUdo Optionally define the current handling user
 * @constructor
 * @extends {crude.Entity}
 */
var AdaptorBase = module.exports = EntityCrud.extend(function(/* optUdo */) {
  /** @type {string} The default 'id' field name */
  this._idName = '_id';

  /** @type {?Object|Function} The ORM model */
  this.Model = null;

  // make sure model is defined before invoking operations.
  this.create.before(this._checkModelExists.bind(this));
  this.read.before(this._checkModelExists.bind(this));
  this.readOne.before(this._checkModelExists.bind(this));
  this.readLimit.before(this._checkModelExists.bind(this));
  this.update.before(this._checkModelExists.bind(this));
  this.delete.before(this._checkModelExists.bind(this));
  this.count.before(this._checkModelExists.bind(this));

});

/**
 * Helper to return the query properly formated based on type of id.
 *
 * @param {string|Object} id the item id or query for item.
 * @protected
 */
AdaptorBase.prototype._getQuery = function(id) {
  var query = {};

  if (__.isObject(id)) {
    return id;
  }

  if (id) {
    query[this._idName] = id;
  }

  return query;
};

/**
 * Dependency Injection.
 *
 * @param {*} The ORM.
 */
AdaptorBase.prototype.setModel = function(/* model */) {
  throw new Error('Not Implemented');
};

/**
 * Checks if model has been set, throws if not
 */
AdaptorBase.prototype._checkModelExists = function() {
  if (!this.Model) {throw new Error('No Mongoose.Model defined, use setModel()');}
};
