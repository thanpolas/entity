/**
 * @fileOverview The Mongoose Normalization methods, will normalize mongodb
 *   awkwardness with '_id' and '__v' attributes.
 */
var cip = require('cip');
// var Promise = require('bluebird');

/**
 * The Mongoose Normalization methods.
 *
 * @constructor
 */
var MongooseNormalize = module.exports = cip.extend();

MongooseNormalize.prototype.normalizeItem = function(item) {
  // Object validations
  if (!item) {
    return item;
  }
  if (typeof item.toObject !== 'function') {
    return item;
  }

  var normalizedItem = this.toObject({getters: true});

  delete normalizedItem.__v;
  delete normalizedItem._id;

  return normalizedItem;
};

/**
 * normalize multiple items.
 *
 * @param {?Array.<Mongoose.Document>} items Array of mongoose documents.
 * @return {Array.<Object>|null} Normalized items.
 */
MongooseNormalize.prototype.normalizeItems = function(items) {
  if (!Array.isArray(items)) {
    return items;
  }

  // This special treatment is warranted because of subtle Mongoose / Array
  // & Object pitfalls, for your own sanity: don't touch it plzzzz
  var item;
  var cleanItems = [];
  while(item = items.shift()) {
    var cleanItem = this.normalizeItem(item);
    cleanItems.push(cleanItem);
  }

  return cleanItems;
};

/**
 * Infers if single or multiple items are provided and invokes corresponding
 * normalizer method.
 *
 * @param {Array.<Mongoose.Document>|Object|null} items The items or item.
 * @return {Array.<Object>|Object|null} The normalized result.
 */
MongooseNormalize.prototype.normalize = function(items) {
  if (Array.isArray(items)) {
    return this.normalizeItems(items);
  } else {
    return this.normalizeItem(items);
  }
};
