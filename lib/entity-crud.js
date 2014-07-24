/*jshint unused:false */

/**
 * @fileOverview The primitive CRUD operations.
 *
 */

var EventEmitter = require('events').EventEmitter;
var util = require('util');

var midd = require('middlewarify');

var Entity = require('./entity');

/**
 * The CRUD Entity Class.
 *
 * @constructor
 * @extends {Entity}
 */
var EntityCrud = module.exports = Entity.extend(function() {

  /** @type {string} The default 'id' field name */
  this._idName = 'id';

  /** @type {Array} Attributes to eager load on queries */
  this._eagerLoad = [];

  /** @type {boolean} Cached switch to let us know there are attrs to eager load */
  this._hasEagerLoad = false;

  /** @type {Array.<Object>} Order by clauses */
  this._sortBy = [];

  /** @type {boolean} Indicates if an order by exists */
  this._hasSortBy = false;

  // Create primitive methods
  this.method('create', this._create.bind(this));
  this.method('read', this._read.bind(this));
  this.method('readOne', this._readOne.bind(this));
  this.method('readLimit', this._readLimit.bind(this));
  this.method('update', this._update.bind(this));
  this.method('delete', this._delete.bind(this));
  this.method('count', this._count.bind(this));

  // Add event emissions
  this.create.last(this.emit.bind(this, 'create'));
  this.update.last(this.emit.bind(this, 'update'));
  this.delete.last(this._deleteEmit.bind(this));
});

/**
 * Set the Model, DI.
 * @param {Object} model
 */
EntityCrud.prototype.setModel = function(model) {
  throw new Error('Not Implemented');
};

/**
 * Mongoose only method for now
 *
 * @param {string|Array|Object} values stuff to eager load
 * @return {this} Chainable.
 */
EntityCrud.prototype.eagerLoad = function(values) {
  this._hasEagerLoad = true;

  if (Array.isArray(values)) {
    this._eagerLoad = this._eagerLoad.concat(values);
  } else {
    this._eagerLoad.push(values);
  }

  return this;
};

/**
 * Apply sortening rules to fetching records.
 *
 * @param {string} attribute The attribute to sort by.
 * @param {string=} optDirection One of: 'DESC', 'ASC'.
 * @return {this} Chainable.
 */
EntityCrud.prototype.sort = function(attribute, optDirection) {
  this._hasSortBy = true;
  var sort = [attribute];
  if (optDirection) {
    sort.push(optDirection);
  }
  this._sortBy.push(sort);
  return this;
};

/**
 * Create an entity item.
 *
 * @param {Object} itemData The data to use for creating.
 * @protected
 */
EntityCrud.prototype._create = function(itemData) {
  throw new Error('Not Implemented');
};

/**
 * Read one entity item.
 *
 * @param {string|Object} id the item id or an Object to query against.
 * @protected
 */
EntityCrud.prototype._readOne = function(id) {
  throw new Error('Not Implemented');
};

/**
 * Read items based on query or if not defined, read all items.
 * Do practice common sense!
 *
 * @param {Object|string=} optQuery Optionally define a query to limit results.
 * @protected
 */
EntityCrud.prototype._read = function(optQuery) {
  throw new Error('Not Implemented');
};

/**
 * Read a limited set of items.
 *
 * @param {?Object} query Narrow down the set, set to null for all.
 * @param {number} skip starting position.
 * @param {number} limit how many records to fetch.
 * @protected
 */
EntityCrud.prototype._readLimit = function(query, skip, limit) {
  throw new Error('Not Implemented');
};

/**
 * Get the count of items.
 *
 * @param {?Object} query Narrow down the set, set to null for all.
 * @protected
 */
EntityCrud.prototype._count = function(query) {
  throw new Error('Not Implemented');
};

/**
 * Update an entity item.
 *
 * @param {string} id the item id.
 * @param {Object} itemData The data to use for creating.
 * @protected
 */
EntityCrud.prototype._update = function(id, itemData) {
  throw new Error('Not Implemented');
};

/**
 * Remove an entity item.
 *
 * @param {string|Object} maybeQuery Query or the item id.
 * @protected
 */
EntityCrud.prototype._delete = function(maybeQuery) {
  throw new Error('Not Implemented');
};

/**
 * The Delete event emission requires special care so it can guarantee that
 * the record ID is properly propagated.
 *
 * @param {string|Object} maybeQuery Query or the item id.
 * @private
 */
EntityCrud.prototype._deleteEmit = function(maybeQuery) {
  var query = this._getQuery(maybeQuery);
  this.emit('delete', maybeQuery, query[this._idName]);
};
