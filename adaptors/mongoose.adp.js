/**
 * @fileOverview The Mongoose CRUD implementation.
 */
var __ = require('lodash');
var mschema = require('mschema');
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

  // Mongoose uses dot notation for paths
  this._schemaOpts.expandPaths = true;

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
  this._readSchema();
};

MongooseAdapter.prototype._defineMethods = function() {
  this._mongFindOne = Promise.promisify(this.Model.findOne, this.Model);
  this._mongFindById = Promise.promisify(this.Model.findById, this.Model);
  this._mongFind = Promise.promisify(this.Model.find, this.Model);
  this._mongRemove = Promise.promisify(this.Model.remove, this.Model);
};

/**
 * Create an entity item.
 *
 * @param {Object} itemData The data to use for creating.
 * @return {Promise(mongoose.Document)} A promise with the mongoose doc.
 * @override
 */
MongooseAdapter.prototype._create = function(itemData) {
  return new Promise(function(resolve, reject) {
    var item = new this.Model(itemData);
    item.save(function(err, document) {
      if (err) { return reject(err); }
      resolve(document);
    });
  }.bind(this));
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

  var self = this;
  return new Promise(function(resolve, reject) {
    self.parseQuery(query, self.Model.find)
      .skip(skip)
      .limit(limit)
      .exec(function(err, result) {
        // there's no escaping that
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
  });
};

/**
 * Get the count of items.
 *
 * @param {?Object} query Narrow down the set, null for all.
 * @return {Promise(number)} A promise with the result.
 * @override
 */
MongooseAdapter.prototype._count = function(query) {
  if (!this.Model) { throw new Error('No Mongoose.Model defined, use setModel()'); }
  return new Promise(function(resolve, reject) {
    this.Model.count(query, function(err, num) {
      if (err) {
        reject(err);
      } else {
        resolve(num);
      }
    });
  }.bind(this));
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
    this.readOne(id).then(function(doc) {
      if (!__.isObject(doc)) {
        return reject(new Error('record not found'));
      }
      __.forOwn(itemData, function(value, key) {
        doc[key] = value;
      }, this);

      doc.save(function(err, document) {
        if (err) { return reject(err); }
        resolve(document);
      });

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
 * Get and store the normalized schema of this MongooseAdapter.
 *
 * @return {mschema} An mschema struct.
 * @private
 */
MongooseAdapter.prototype._readSchema = function() {
  var mongooseSchema = this.Model.schema.paths;

  __.forIn(mongooseSchema, function(mongSchemaItem, path) {
    var typeMongoose = mongSchemaItem.options.type;
    var type;
    if (typeof typeMongoose === 'function' && typeMongoose.name) {
      type = typeMongoose.name.toLowerCase();
      if (!(type in mschema.types)) {
        if (type === 'objectid' || type === 'date') {
          type = 'string';
        } else {
          type = 'any';
        }
      }
    } else if (Array.isArray(typeMongoose)) {
      type = ['string'];
    } else {
      type = 'string';
    }

    this.addSchema(path, type);
  }, this);
};

/**
 * Parse an entity type query and translate to mongoose.
 *
 * @param {?Object} query The query
 * @return {Object} The mongoose return value of find().
 */
MongooseAdapter.prototype.parseQuery = function(query) {
  if (!query) {
    return this.Model.find();
  }

  if (!__.isObject(query)) {
    return this.Model.find(query);
  }

  var selectors = {};
  var cleanQuery = {};
  __.forIn(query, function(value, key) {
    if (__.isObject(value)) {
      selectors[key] = value;
    } else {
      cleanQuery[key] = value;
    }
  });

  var findMethod = this.Model.find(cleanQuery);

  __.forIn(selectors, function(item, key) {
    var pair = __.pairs(item);
    findMethod = findMethod.where(key)[pair[0]](pair[1]);
  });

  return findMethod;
};
