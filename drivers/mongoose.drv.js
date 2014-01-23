/**
 * @fileOverview The Mongoose CRUD implementation.
 */
var util = require('util');

var __ = require('lodash');
var Driver = require('./base.drv');

/**
 * The Mongoose CRUD implementation.
 *
 * @param {mongoose.Model} Model the model that this entity relates to.
 * @param {Object=} optUdo Optionally define the current handling user.
 * @constructor
 * @extends {Entity.Driver}
 */
var Entity = module.exports = function(Model, optUdo) {
  Driver.call(this, optUdo);

  /** @type {string} The default 'id' field name */
  this._idName = '_id';


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

  /** @type {mongoose.Model} The mongoose model */
  this.Model = Model;
};
util.inherits(Entity, Driver);

/**
 * Create an entity item.
 *
 * @param {Object} itemData The data to use for creating.
 * @param {Function(Error=, mongoose.Document=)} done callback.
 * @override
 */
Entity.prototype._create = function(itemData, done) {
  var item = new this.Model(itemData);
  item.save(done);
};

/**
 * Read one entity item.
 *
 * @param {string|Object} id the item id or an Object to query against.
 * @param {Function(Error=, mongoose.Document=)} done callback.
 * @override
 */
Entity.prototype._readOne = function(id, done) {
  var query;
  if (__.isObject(id)) {
    query = this.Model.findOne.bind(this.Model);
  } else {
    query = this.Model.findById.bind(this.Model);
  }
  query(id, done);
};

/**
 * Read items based on query or if not defined, read all items.
 * Do practice common sense!
 *
 * @param {Object=} optQuery Limit the results.
 * @param {Function(Error=, mongoose.Document=)} done callback.
 * @override
 */
Entity.prototype._read = function(optQuery, done) {
  var query = {};
  if (__.isFunction(optQuery)) {
    done = optQuery;
  } else if (__.isObject(optQuery)) {
    query = optQuery;
  }

  this.Model.find(query).exec(done);
};

/**
 * Read a limited set of items.
 *
 * @param {?Object} query Narrow down the set, set to null for all.
 * @param {number} skip starting position.
 * @param {number} limit how many records to fetch.
 * @param {Function(Error=, Array.<mongoose.Document>=)} done callback.
 * @override
 */
Entity.prototype._readLimit = function(query, skip, limit, done) {
  this.Model.find(query)
    .skip(skip)
    .limit(limit)
    .exec(done);
};

/**
 * Get the count of items.
 *
 * @param {?Object} query Narrow down the set, null for all.
 * @param {Function(Error=, number=)} done callback.
 * @override
 */
Entity.prototype._count = function(query, done) {
  this.Model.count(query).exec(done);
};

/**
 * Update an entity item.
 *
 * @param {string|Object} id the item id or query for item.
 * @param {Object} itemData The data to use for creating.
 * @param {Function(Error=, mongoose.Document=)} done callback.
 * @override
 */
Entity.prototype._update = function(id, itemData, done) {
  var query;
  if (__.isObject(id)) {
    query = this.Model.findOne.bind(this.Model);
  } else {
    query = this.Model.findById.bind(this.Model);
  }

  query(id, function(err, doc){
    if (err) { return done(err); }
    if (!__.isObject(doc)) {
      return done(new Error('record not found'));
    }
    __.forOwn(itemData, function(value, key) {
      doc[key] = value;
    }, this);

    doc.save(done);

  }.bind(this));
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
  this.Model.remove(query).exec().addBack(done);
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
Entity.prototype._getName = function(path, optOpts) {
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
Entity.prototype._canShow = function(schemaItem, optOpts) {
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
