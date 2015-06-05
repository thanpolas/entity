/**
 * @fileOverview The Sequelize CRUD implementation.
 */

var __ = require('lodash');
var Promise = require('bluebird');

var AdaptorBase = require('./base.adp');

/**
 * The Sequelize CRUD implementation.
 *
 * @param {Object=} optUdo Optionally define the current handling user.
 * @constructor
 * @extends {Entity.AdaptorBase}
 */
var SequelizeAdaptor = module.exports = AdaptorBase.extend(function(/* optUdo */) {
  /** @type {string} The default 'id' field name */
  this._idName = 'id';

});

/**
 * Set the Sequelize Model.
 *
 * @param {mongoose.Model} Model The mongoose model.
 */
SequelizeAdaptor.prototype.setModel = function(Model) {
  // perform some heuristics on Model identity cause instanceof will not work
  if (
    !Model ||
    !Model.name ||
    !Model.tableName ||
    !Model.options ||
    !Model.sequelize
    ) {
    throw new TypeError('Model provided not a Sequelize instance');
  }

  this.Model = Model;

  this._readSchema();
};

/**
 * Create an entity item.
 *
 * @param {Object} itemData The data to use for creating.
 * @return {Promise(Sequelize.Document)} A promise with the sequelize doc.
 * @override
 */
SequelizeAdaptor.prototype._create = function(itemData) {
  var item = this.Model.build(itemData);
  return Promise.cast(item.save());
};

/**
 * Read one entity item.
 *
 * @param {string|Object} id the item id or an Object to query against.
 * @return {Promise(Sequelize.Document)} A promise with the sequelize doc.
 * @override
 */
SequelizeAdaptor.prototype._readOne = function(id) {
  var query = this._getQuery(id);

  var findOpts = {
    where: query,
    offset: 0,
    limit: 1,
  };

  findOpts = this._checkEagerLoad(findOpts);

  return Promise.cast(this.Model.find(findOpts));
};

/**
 * Read items based on query or if not defined, read all items.
 * Do practice common sense!
 *
 * @param {Object=} optQuery Limit the results.
 * @return {Promise(Sequelize.Document)} A promise with the sequelize doc.
 * @override
 */
SequelizeAdaptor.prototype._read = function(optQuery) {
  var findOpts = {};
  if (optQuery) {
    findOpts.where = this._getQuery(optQuery);
  }

  findOpts = this._checkEagerLoad(findOpts);
  findOpts = this._checkSorting(findOpts);

  return Promise.cast(this.Model.findAll(findOpts));
};

/**
 * Read a limited set of items.
 *
 * @param {?Object} query Narrow down the set, set to null for all.
 * @param {number} skip starting position.
 * @param {number} limit how many records to fetch.
 * @return {Promise(Sequelize.Document)} A promise with the sequelize doc.
 * @override
 */
SequelizeAdaptor.prototype._readLimit = function(query, skip, limit) {
  if (!__.isNull(query)) {
    query = this._getQuery(query);
  }

  var findOpts = {
    offset: skip,
    limit: limit,
  };

  findOpts = this._checkEagerLoad(findOpts);
  findOpts = this._checkSorting(findOpts);

  if (query) {
    findOpts.where = query;
  }

  return Promise.cast(this.Model.findAll(findOpts));
};

/**
 * Get the count of items.
 *
 * @param {Object=} query optionally narrow down the set.
 * @return {Promise(number)} A promise with the result.
 * @override
 */
SequelizeAdaptor.prototype._count = function(query) {
  var findOpts = {};
  if (query) {
    findOpts.where = this._getQuery(query);
  }
  return Promise.cast(this.Model.count(findOpts));
};

/**
 * Update an entity item.
 *
 * @param {string|Object} id the item id or query for item.
 * @param {Object} itemData The data to use for creating.
 * @return {Promise()} A promise.
 * @override
 */
SequelizeAdaptor.prototype._update = function(id, itemData) {
  var query = this._getQuery(id);

  return Promise.cast(this.Model.update(itemData, query));
};

/**
 * Remove an entity item.
 *
 * @param {string|Object} id the item id or query for item.
 * @return {Promise()} A promise.
 * @protected
 */
SequelizeAdaptor.prototype._delete = function(id) {
  var query = this._getQuery(id);
  return Promise.cast(this.Model.destroy(query));
};

/**
 * Read the Sequelize schema and normalize it.
 *
 * @return {mschema} An mschema struct.
 * @private
 */
SequelizeAdaptor.prototype._readSchema = function() {
  var seqSchema = this.Model.rawAttributes;

  __.forIn(seqSchema, function(seqSchemaItem, path) {
    var seqType = seqSchemaItem.type.toString();

    var schemaItem = {};
    schemaItem[path] = {
      type: this._determineType(seqType),
    };

    if (this._isSequelizeSpecialAttribute(path)) {
      schemaItem[path].canShow = false;
    }

    this.addSchema(schemaItem);
  }, this);
};

/**
 * Map Sequelize types to mschema.
 *
 * @param {string} seqType The sequelize type.
 * @return {string} an mschema type.
 */
SequelizeAdaptor.prototype._determineType = function(seqType) {
  var type = 'any';
  switch(seqType) {
  case 'STRING':
  case 'BLOB':
  case 'TEXT':
  case 'DATE':
  case 'DATETIME':
  case 'NOW':
  case 'TIMESTAMP WITH TIME ZONE':
    type = 'string';
    break;
  case 'BIGINT':
  case 'FLOAT':
  case 'INTEGER':
    type = 'number';
    break;
  case 'BOOLEAN':
    type = 'boolean';
    break;
  default:
    if (seqType.indexOf('VARCHAR') >= 0) {
      type = 'string';
    } else if (seqType.indexOf('ENUM') >= 0) {
      type = 'string';
    } else if (seqType.indexOf('TINYINT') >= 0) {
      type = 'number';
    }
  }

  return type;
};

/**
 * Checks if attribute name is a special Sequelize one, determines
 * visibility --> canShow.
 *
 * @param {string} path The attribute name.
 * @return {boolean} yes/no.
 */
SequelizeAdaptor.prototype._isSequelizeSpecialAttribute = function(path) {
  return [
    'createdAt',
    'updatedAt',
  ].indexOf(path) >= 0;
};

/**
 * Checks if eager loading exists for any attribute and applies it.
 *
 * @param {sequelize.Query} query The query object.
 * @return {sequelize.Query} The query object.
 * @private
 */
SequelizeAdaptor.prototype._checkEagerLoad = function(query) {
  if (!this._hasEagerLoad) {
    return query;
  }

  query.include = [];
  this._eagerLoad.forEach(function(attr) {
    query.include.push(attr);
  });

  return query;
};


/**
 * Checks for sorting and applies it.
 *
 * @param {sequelize.Query} query The query object.
 * @return {sequelize.Query} The query object.
 * @private
 */
SequelizeAdaptor.prototype._checkSorting = function(query) {
  if (!this._hasSortBy) {
    return query;
  }

  query.order = this._sortBy;
  return query;
};
