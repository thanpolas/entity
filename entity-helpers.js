/**
 * @fileOverview Helper functions for normalizing ORM Schemas, etc.
 */

var helpers = module.exports = {};

/**
 * Return a proper label for the key.
 *
 * @param {string} path The full path name.
 * @param {Object} opts The CRUD-controller options object.
 * @return {[type]}      [description]
 */
helpers.getName = function(path, opts) {
  var name;
  if (opts.expandPaths) {
    name = path;
  } else {
    name = path.split('.').pop();
  }
  return name.charAt(0).toUpperCase() + name.slice(1);
};

/**
 * Determine if this schema item should be publicly displayed.
 *
 * @param  {Object} schemaItem A single schema item (a column).
 * @param {Object} opts The CRUD-controller options object.
 * @return {boolean} true to show.
 */
helpers.canShow = function(schemaItem, opts) {
  // check for custom excluded paths
  if (opts.viewExcludePaths.length) {
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
