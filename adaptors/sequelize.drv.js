/**
 * @fileOverview The Sequelize CRUD implementation.
 */
var util = require('util');

var __ = require('lodash');

var Driver = require('./base.drv');

/**
 * The Sequelize CRUD implementation.
 *
 * @param {Sequelize.Model} Model The Sequelize model to apply CRUD ops on.
 * @param {Object=} optUdo Optionally define the current handling user.
 * @constructor
 * @extends {Entity.Driver}
 */
var Entity = module.exports = function(Model, optUdo) {
  Driver.call(this, optUdo);

  // perform some heuristics on Model identity cause instanceof will not work
  if (
    !Model ||
    !Model.name ||
    !Model.tableName ||
    !Model.options ||
    !Model.DAO

    ) {
    throw new TypeError('Model provided not a Sequelize instance');
  }

  /** @type {Sequelize.Model} The sequelize Model */
  this.Model = Model;
};
util.inherits(Entity, Driver);

/**
 * Create an entity item.
 *
 * @param {Object} itemData The data to use for creating.
 * @param {Function(Error=, Object=)} done callback.
 * @override
 */
Entity.prototype._create = function(itemData, done) {
  var item = this.Model.build(itemData);
  // this._handleOp(item.save(), done, itemData);
  item.save()
    .success(__.partial(done, null))
    .error(done);
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

  var findOpts = {};
  if (query) {
    findOpts.where = query;
  }

  this.Model.findAll(findOpts)
    .success(__.partial(done, null))
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

  var findOpts = {
    offset: skip,
    limit: limit,
  };

  if (query) {
    findOpts.where = query;
  }

  this.Model.findAll(findOpts)
    .success(__.partial(done, null))
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
  var findOpts = {};
  if (query) {
    findOpts.where = query;
  }
  this.Model.count(findOpts)
    .success(__.partial(done, null))
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

  this.Model.update(itemData, query)
    .success(__.partial(done, null, itemData))
    .error(done);
};

/**
 * Remove an entity item.
 *
 * @param {string|Object} id the item id or query for item.
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
 * Get the normalized schema of this Entity.
 *
 * @return {mschema} An mschema struct.
 */
Entity.prototype.getSchema = function() {
  if (this._schema) {
    return this._schema;
  }
  var seqSchema = this.Model.rawAttributes;
  this._schema = [];

  __.forIn(seqSchema, function(seqSchemaItem, path) {
    var schemaItem = {
      canShow: this._canShow(path),
      name: path,
      path: path,
    };

    this._schema.push(schemaItem);
  }, this);

  return this._schema;
};

/**
 * Determine if this schema item should be publicly displayed.
 *
 * @param {string} path A single schema path (a key).
 * @return {boolean} true to show.
 * @private
 */
Entity.prototype._canShow = function(path) {
  // check for private vars (starting with underscore)
  if ('_' === path.charAt(0)) {
    return false;
  }

  // check for known Sequelize variables
  if ([
    'createdAt',
    'updatedAt',
  ].indexOf(path) > -1) {
    return false;
  }

  return true;
};
