/**
 * @fileOverview Utility functions.
 */

var helper = module.exports = {};

helper.callbackify = function(hasCb, done, deferred) {
  return function(err) {
    if (err) {
      if (hasCb) {
        done(err);
        return deferred.reject(err);
      }
    }
    var args = Array.prototype.slice.call(arguments, 1);
    if (hasCb) {
      done.apply(null, arguments);
    }
    deferred.resolve(args);
  };
};