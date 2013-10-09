/**
 * @fileOverview The Sequelize CRUD implementation.
 */
var util = require('util');

var __ = require('lodash');
var EntityCrud = require('../entity-crud');

/**
 * The Sequelize CRUD implementation.
 *
 * @param {Sequelize.Model} Model The Sequelize model to apply CRUD ops on.
 * @param {Object=} optUdo Optionally define the current handling user.
 * @constructor
 * @extends {crude.Entity}
 */
var Entity = module.exports = function(Model, optUdo) {
  EntityCrud.call(this, optUdo);

  // perform some heuristics on Model identity cause instanceof will not work
  if (
    !Model ||
    !Model.name ||
    !Model.tableName ||
    !Model.options ||
    !Model.DAO

    ) {
    throw new TypeError('Model provided not a Mongoose.Model instance');
  }

  /** @type {Sequelize.Model} The sequelize Model */
  this.Model = Model;
};
util.inherits(Entity, EntityCrud);

/**
 * Create an entity item.
 *
 * @param {Object} itemData The data to use for creating.
 * @param {Function(Error=, Object=)} done callback.
 * @override
 */
Entity.prototype._create = function(itemData, done) {
  var item = this.Model.build(itemData);
  this._handleOp(item.save(), done, itemData);
};

/**
 * Read one entity item.
 *
 * @param {string|Object} id the item id or an Object to query against.
 * @param {Function(Error=, Object=)} done callback.
 * @override
 */
Entity.prototype._readOne = function(id, done) {
  var query = this._getQuery(id);

  this.Model.find({
    where: query,
    offset: 0,
    limit: 1,
  })
    .success(function(res) {
      done(null, res);
    })
    .error(done);
};

/**
 * Read items based on query or if not defined, read all items.
 * Do practice common sense!
 *
 * @param {Object=} optQuery Limit the results.
 * @param {Function(Error=, Object=)} done callback.
 * @override
 */
Entity.prototype._read = function(optQuery, done) {
  var query;

  if (__.isFunction(optQuery)) {
    done = optQuery;
  } else {
    query = this._getQuery(optQuery);
  }

  this.Model.findAll({
    where: query,
  })
    .success(function(res) {
      done(null, res);
    })
    .error(done);
};

/**
 * Read a limited set of items.
 *
 * @param {?Object} query Narrow down the set, set to null for all.
 * @param {number} skip starting position.
 * @param {number} limit how many records to fetch.
 * @param {Function(Error=, Array.<Object>=)} done callback.
 * @override
 */
Entity.prototype._readLimit = function(query, skip, limit, done) {
  if (!__.isNull(query)) {
    query = this._getQuery(query);
  }

  this.Model.findAll({
    where: query,
    offset: skip,
    limit: limit,
  })
    .success(function(res) {
      done(null, res);
    })
    .error(done);
};

/**
 * Get the count of items.
 *
 * @param {?Object} query Narrow down the set, null for all.
 * @param {Function(Error=, number=)} done callback.
 * @override
 */
Entity.prototype._count = function(query, done) {
  if (!__.isNull(query)) {
    query = this._getQuery(query);
  }

  this.Model.count({where: query})
    .success(function(c) {
      done(null, c);
    })
    .error(done);
};

/**
 * Update an entity item.
 *
 * @param {string|Object} id the item id or query for item.
 * @param {Object} itemData The data to use for creating.
 * @param {Function(Error=, Object)} done callback.
 * @override
 */
Entity.prototype._update = function(id, itemData, done) {
  var query = this._getQuery(id);

  this._handleOp(
    this.Model.update(itemData, query),
    done,
    itemData
  );
};

/**
 * Remove an entity item.
 *
 * @param {string} id the item id.
 * @param {Function(Error=, Object=)} done callback.
 * @protected
 */
Entity.prototype._delete = function(id, done) {
  var query = this._getQuery(id);
  this._handleOp(this.Model.destroy(query), done);
};

/**
 * Helper for handling Sequelize type outcomes.
 *
 * @param {Object} op a promise object.
 * @param {Function} done the callback.
 * @param {Object=} optItemData Data passed to the op.
 * @private
 */
Entity.prototype._handleOp = function(op, done, optItemData) {
  op
    .success(done.bind(null, null, optItemData))
    .error(done);
};

/**
 * Helper to return the query properly formated based on type of id.
 *
 * @param {string|Object} id the item id or query for item.
 * @private
 */
Entity.prototype._getQuery = function(id) {
  return (__.isObject(id)) ? id : {id:id};
};
