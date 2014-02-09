/**
 * @fileOverview Schema implementation.
 */

var __ = require('lodash');
var mschema = require('mschema');
var inher = require('inher');

/**
 * Schema Implementation
 *
 * @constructor
 * @extends {Inher}
 */
var Schema = module.exports = inher.extend(function() {
  /** @type {?mschema} Cached version of Schema's schema */
  this._schema = Object.create(null);

  /** @type {Object} A dictionary with options, set on ctor. */
  this._schemaOpts = {
    expandPaths: false,
  };
});

/**
 * A Schema Item, the Object literal that is value for every attribute.
 *
 * WARNING use this.getNewSchemaItem() to get a fresh new item.
 * 
 * @typedef {{
 *   canShow        : boolean,
 *   name           : ?string,
 *   path           : ?string,
 *   type           : string
 *   }}
 */
Schema.Item = {
  canShow: false,
  name: null,
  path: null,
};

/*
 * A normalized format for fetching the schema.
 *
 * @return {mschema}
 */
Schema.prototype.getSchema = function() {
  return this._schema;
};

/**
 * Add to schema
 *
 * @param {mschema|string} schemaKey mschema object or attribute name.
 * @param {mschema|string=} optSchemaVal mschema value or value.
 * @return {self}
 */
Schema.prototype.addSchema = function(schemaKey, optSchemaVal) {
  var paths = [];

  switch(typeof schemaKey) {
  case 'object':
    __.forOwn(schemaKey, function(value, path) {
      paths.push([path, value]);
    });
    break;
  case 'string':
    paths.push([schemaKey, optSchemaVal]);
    break;
  default:
    throw new TypeError('Wrong type of arguments');
  }

  paths.forEach(this._assignSchemaItem.bind(this));

  return this;
};

/**
 * Assign a Schema Item to the schema.
 * 
 * @param {Array} tuple A set of two items, path and value of the item to add.
 * @protected
 */
Schema.prototype._assignSchemaItem = function(tuple) {
  var path = tuple[0];
  var value = tuple[1];
  var attributeName = this._getName(path);
  this._schema[attributeName] = this.getNewSchemaItem();
  this._schema[attributeName].canShow = this._canShow(path, value);
  this._schema[attributeName].name = attributeName;
  this._schema[attributeName].path = path;
  this._schema[attributeName].type = this._getType(value);
};

/**
 * Remove from schema
 *
 * @param {string} attribute The attribute to remove.
 * @return {self}
 */
Schema.prototype.remSchema = function(attribute) {
  delete this._schema[attribute];
  return this;
};

/**
 * Get a new Schema Item.
 * @return {Object} Schema Item.
 */
Schema.prototype.getNewSchemaItem = function() {
  return Object.create(Schema.Item);
};

/**
 * Return a proper label for the key.
 *
 * @param {string} path The full path name.
 * @return {string} The field's name.
 * @protected
 */
Schema.prototype._getName = function(path) {
  var name;
  if (this._schemaOpts.expandPaths) {
    name = path;
  } else {
    name = path.split('.').pop();
  }
  return name;
};

/**
 * Determine the type of the attribute based on value.
 * 
 * @param {string|Object} value The value
 * @return {mschema.types} The mschema type.
 * @protected
 */
Schema.prototype._getType = function(value) {
  if (typeof value === 'string') {
    if (value in mschema.types) {
      return value;
    } else {
      return 'any';
    }
  }

  if (__.isObject(value)) {
    if (value.type) {
      if (value.type in mschema.types) {
        return value.type;
      }
    }
  }

  return 'any';
};

/**
 * Determine if this schema item should be publicly displayed.
 *
 * @param {string} path The full path name.
 * @param {string|Object} value may contain 'canShow' information.
 * @return {boolean} true to show.
 * @protected
 */
Schema.prototype._canShow = function(path, value) {
  if (__.isObject(value)) {
    if ('canShow' in value && typeof value.canShow === 'boolean') {
      return value.canShow;
    }
  }

  // check for private vars (starting with underscore)
  if (path.charAt(0) === '_') {
    return false;
  } else {
    return true;
  }
};
