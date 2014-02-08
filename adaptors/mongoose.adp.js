/**
 * @fileOverview The Mongoose CRUD implementation.
 */
var __ = require('lodash');
var Promise = require('bluebird');

var AdaptorBase = require('./base.adp');

function noop() {}

/**
 * The Mongoose CRUD implementation.
 *
 * @param {?Object} optUdo Optionally define the current handling user.
 * @param {mongoose.Model} Model the model that this entity relates to.
 * @constructor
 * @extends {MongooseAdapter.AdaptorBase}
 */
var MongooseAdapter = module.exports = AdaptorBase.extend(function(/* optUdo */) {
  /** @type {?mongoose.Model} The mongoose model */
  this.Model = null;

  // stub internal methods, all should be private to instance
  this._mongFindOne = noop;
  this._mongFindById = noop;
  this._mongFind = noop;
  this._mongCount = noop;
  this._mongSave = noop;
  this._mongRemove = noop;
});

/**
 * Set the Mongoose Model.
 *
 * @param {mongoose.Model} Model The mongoose model.
 */
MongooseAdapter.prototype.setModel = function(Model) {
  // perform some heuristics on Model identity cause instanceof will not work
  if (
    !Model ||
    Model.name !== 'model' ||
    !Model.db ||
    !Model.model ||
    !Model.schema
  ) {
    throw new TypeError('Model provided not a Mongoose.Model instance');
  }
  this.Model = Model;

  this._defineMethods();
};

MongooseAdapter.prototype._defineMethods = function() {
  this._create = Promise.promisify(this.Model.prototype.save);
  this._mongFindOne = Promise.promisify(this.Model.prototype.findOne);
  this._mongFindById = Promise.promisify(this.Model.prototype.findById);
  this._mongFind = Promise.promisify(this.Model.prototype.find);
  this._mongCount = Promise.promisify(this.Model.prototype.count);
  this._mongSave = Promise.promisify(this.Model.prototype.save);
  this._mongRemove = Promise.promisify(this.Model.prototype.remove);
};

/**
 * Create an entity item.
 *
 * @param {Object} itemData The data to use for creating.
 * @return {Promise(mongoose.Document)} A promise with the mongoose doc.
 * @override
 */
MongooseAdapter.prototype._create = function() {
  throw new Error('No Mongoose.Model defined, use setModel()');
};

/**
 * Read one entity item.
 *
 * @param {string|Object} id the item id or an Object to query against.
 * @return {Promise(mongoose.Document)} A promise with the mongoose doc.
 * @override
 */
MongooseAdapter.prototype._readOne = function(id) {
  if (!this.Model) { throw new Error('No Mongoose.Model defined, use setModel()'); }

  if (__.isObject(id)) {
    return this._mongFindOne(id);
  } else {
    return this._mongFindById(id);
  }
};

/**
 * Read items based on query or if not defined, read all items.
 * Do practice common sense!
 *
 * @param {Object=} optQuery Limit the results.
 * @return {Promise(mongoose.Document)} A promise with the mongoose doc.
 * @override
 */
MongooseAdapter.prototype._read = function(optQuery) {
  if (!this.Model) { throw new Error('No Mongoose.Model defined, use setModel()'); }

  return this._mongFind(optQuery || {});
};

/**
 * Read a limited set of items.
 *
 * @param {?Object} query Narrow down the set, set to null for all.
 * @param {number} skip starting position.
 * @param {number} limit how many records to fetch.
 * @return {Promise(mongoose.Document)} A promise with the mongoose doc.
 * @override
 */
MongooseAdapter.prototype._readLimit = function(query, skip, limit) {
  if (!this.Model) { throw new Error('No Mongoose.Model defined, use setModel()'); }

  return new Promise(function(resolve, reject) {
    this.Model.find(query)
      .skip(skip)
      .limit(limit)
      .exec(function(err, result) {
        // there's no escaping that
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
  }.bind(this));
};

/**
 * Get the count of items.
 *
 * @param {?Object} query Narrow down the set, null for all.
 * @return {Promise(number)} A promise with the result.
 * @override
 */
MongooseAdapter.prototype._count = function() {
  if (!this.Model) { throw new Error('No Mongoose.Model defined, use setModel()'); }
};

/**
 * Update an entity item.
 *
 * @param {string|Object} id the item id or query for item.
 * @param {Object} itemData The data to use for creating.
 * @return {Promise(mongoose.Document)} A promise with the mongoose doc.
 * @override
 */
MongooseAdapter.prototype._update = function(id, itemData) {
  if (!this.Model) { throw new Error('No Mongoose.Model defined, use setModel()'); }

  return new Promise(function(resolve, reject) {
    return this.readOne(id).then(function(doc) {
      if (!__.isObject(doc)) {
        return reject(new Error('record not found'));
      }
      __.forOwn(itemData, function(value, key) {
        doc[key] = value;
      }, this);

      return this._mongSave();
    }.bind(this), reject);
  }.bind(this));
};

/**
 * Remove an entity item.
 *
 * @param {string|Object} id the item id or query for item.
 * @return {Promise(Object=)} A promise.
 * @protected
 */
MongooseAdapter.prototype._delete = function(id) {
  if (!this.Model) { throw new Error('No Mongoose.Model defined, use setModel()'); }

  var query = this._getQuery(id);
  return this._mongRemove(query);
};

/**
 * Get the normalized schema of this MongooseAdapter.
 *
 * @return {mschema} An mschema struct.
 */
MongooseAdapter.prototype.getSchema = function() {
  if (!this.Model) { throw new Error('No Mongoose.Model defined, use setModel()'); }

  if (this._schema) {
    return this._schema;
  }
  var mongooseSchema = this.Model.schema.paths;
  this._schema = [];

  __.forIn(mongooseSchema, function(mongSchemaItem, path) {
    var schemaItem = {
      // TODO this helper needs a second arg, opt to check  for expandedPaths key.
      canShow: this._canShow(mongSchemaItem),
      name: this._getName(path, this.opts),
      path: path,
    };

    this._schema.push(schemaItem);
  }, this);

  return this._schema;
};

/**
 * Return a proper label for the key.
 *
 * @param {string} path The full path name.
 * @param {Object} optOpts The CRUD-controller options object.
 * @return {string} The field's name.
 * @private
 */
MongooseAdapter.prototype._getName = function(path, optOpts) {
  if (!this.Model) { throw new Error('No Mongoose.Model defined, use setModel()'); }
  var opts = optOpts || {};

  var name;
  if (opts.expandPaths) {
    name = path;
  } else {
    name = path.split('.').pop();
  }
  return name;
};

/**
 * Determine if this schema item should be publicly displayed.
 *
 * @param  {Object} schemaItem A single schema item (a column).
 * @param {Object=} optOpts The CRUD-controller options object.
 * @return {boolean} true to show.
 * @private
 */
MongooseAdapter.prototype._canShow = function(schemaItem, optOpts) {
  if (!this.Model) { throw new Error('No Mongoose.Model defined, use setModel()'); }
  var opts = optOpts || {};

  // check for custom excluded paths
  if (opts.viewExcludePaths && opts.viewExcludePaths.length) {
    if (0 <= opts.viewExcludePaths.indexOf(schemaItem.path)) {
      return false;
    }
  }

  // check for private vars (starting with underscore)
  if ('_' === schemaItem.path.charAt(0)) {
    if (opts.showId && '_id' === schemaItem.path) {
      return true;
    }
    return false;
  } else {
    return true;
  }
};
