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
  var self = this;
  return new Promise(function(resolve, reject) {
    var item = new self.Model(itemData);
    item.save(function(err, document) {
      if (err) { return reject(err); }

      if (self._hasEagerLoad) {
        self._readOne(document._id).then(resolve, reject);
      } else {
        resolve(document);
      }
    });
  });
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

  var self = this;
  return new Promise(function(resolve, reject) {
    var query;
    if (__.isObject(id)) {
      query = self.Model.findOne(id);
    } else {
      query = self.Model.findById(id);
    }

    query = self._checkEagerLoad(query);

    // intercept "Cast to ID" error types and return null instead
    return query.exec(function(err, res) {
      if (err) {
        if (err.name === 'CastError' && err.type === 'ObjectId') {
          resolve(null);
        } else {
          reject(err);
        }
        return;
      }
      resolve(res);
    });
  });
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

  var self = this;
  return new Promise(function(resolve, reject) {
    var query = optQuery || {};
    self.parseQuery(query)
      .exec(function(err, result) {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
  });
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
    self.parseQuery(query)
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
  var self = this;
  return new Promise(function(resolve, reject) {
    self.parseQuery(query, true)
      .exec(function(err, num) {
        if (err) {
          reject(err);
        } else {
          resolve(num);
        }
      });
  });
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
  var self = this;
  return new Promise(function(resolve, reject) {
    self.readOne(id).then(function(doc) {
      if (!__.isObject(doc)) {
        return reject(new Error('record not found'));
      }
      __.forOwn(itemData, function(value, key) {
        doc[key] = value;
      });

      doc.save(function(err) {
        if (err) { return reject(err); }
        resolve(doc);
      });

    }, reject);
  });
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
 * @param {?Object} query The query.
 * @param {boolean=} optCount if this is a count operation.
 * @return {Object} The mongoose return value of find().
 */
MongooseAdapter.prototype.parseQuery = function(query, optCount) {

  var mongQuery = null;
  var mongMethod = null;

  if (optCount) {
    mongMethod = this.Model.count.bind(this.Model);
  } else {
    mongMethod = this.Model.find.bind(this.Model);
  }

  if (!query) {
    // nothing
    mongQuery = mongMethod();
  } else {
    if (!__.isObject(query)) {
      // possibly just an ID
      mongQuery = mongMethod(query);
    } else {
      // query using object
      var fullQuery = this._separateSelectors(query);
      mongQuery = mongMethod(fullQuery.cleanQuery);
      mongQuery = this._transpileSelectors(mongQuery, fullQuery.selectors);
    }
  }

  if (!optCount) {
    mongQuery = this._checkEagerLoad(mongQuery);
    mongQuery = this._checkSorting(mongQuery);
  }

  return mongQuery;
};

/**
 * Separates selectors (lt, gt, etc) and clean attribute queries.
 *
 * Returns an object with two constant keys "selectors" and "cleanQuery"
 *
 * @param {Object} query The raw query.
 * @return {Object} contains two constant keys "selectors" and "cleanQuery".
 */
MongooseAdapter.prototype._separateSelectors = function(query) {
  var result = {
    selectors: {},
    cleanQuery: {},
  };
  __.forIn(query, function(value, key) {
    if (__.isObject(value)) {
      result.selectors[key] = value;
    } else {
      result.cleanQuery[key] = value;
    }
  });

  return result;
};

/**
 * Transpile a sequelize type extended query with selectors like "lt, lte, gt"
 * to mongoose type.
 *
 * @param {mongoose.Query} findMethod A mongoose query builder instance.
 * @param {Object} selectors Selectors.
 * @return {mongoose.Query} The mongoose query builder to perform an .exec() on.
 * @see http://sequelizejs.com/docs/1.7.8/models#finders
 * @see https://github.com/sequelize/sequelize/wiki/API-Reference-Model#findalloptions-queryoptions----promisearrayinstance
 * @see http://mongoosejs.com/docs/queries.html
 */
MongooseAdapter.prototype._transpileSelectors = function(findMethod, selectors) {
  __.forIn(selectors, function(item, key) {
    var pair = __.pairs(item);
    var selector = pair[0][0];
    var value = pair[0][1];

    switch(selector) {
    case 'between':
      findMethod = findMethod.where(key).gt(value[0]).lt(value[1]);
      break;
    default:
      findMethod = findMethod.where(key)[selector](value);
      break;
    }
  });

  return findMethod;
};

/**
 * Checks if eager loading exists for any attribute and applies it.
 *
 * @param {mongoose.Query} query The query object.
 * @return {mongoose.Query} The query object.
 * @private
 */
MongooseAdapter.prototype._checkEagerLoad = function(query) {
  if (!this._hasEagerLoad) {
    return query;
  }
  this._eagerLoad.forEach(function(attr) {
    query = query.populate(attr);
  });

  return query;
};

/**
 * Checks for sorting and applies it.
 *
 * @param {mongoose.Query} query The query object.
 * @return {mongoose.Query} The query object.
 * @private
 */
MongooseAdapter.prototype._checkSorting = function(query) {
  if (!this._hasSortBy) {
    return query;
  }

  this._sortBy.forEach(function(sort) {
    var obj = {};
    var test = 1;
    if (sort[1] === 'DESC') {
      test = -1;
    }
    obj[sort[0]] = test;
    query.sort(obj);
  });
  return query;
};
