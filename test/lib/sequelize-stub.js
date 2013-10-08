/**
 * @fileOverview Stub a Sequelize model.
 */
var exec = require('child_process').exec;

var Sequelize = require('sequelize');

var seq = module.exports = {};

var _init = false;

/**
 * Define the seq schema
 * @type {Object}
 */
seq.Schema = {
  name: {type: String, trim: true, required: true},
  isActive: {type: Boolean, required: true, default: true},
};

/** @type {?Sequelize} The main Sequelize instance */
seq.instance = null;

/** @type {?Sequelize.Model} The sequelize model */
seq.Model = null;

/**
 * Create a connection with Postgres and init models.
 *
 * @param {Function} done callback.
 * @private
 */
seq.connect = function(done) {
  if (_init) {return done();}
  _init = true;

  var createUserCmd = 'createuser postgres --superuser --createdb';
  var createDbCmd = 'createdb -O postgres entity_test';
  exec(createUserCmd, {}, function(err) {
    if (err && err.message.indexOf('already exists') === -1) { return done(err);}
    exec(createDbCmd, {}, function(err) {
      if (err && err.message.indexOf('already exists') === -1) { return done(err);}

      seq.instance = new Sequelize(
        'entity_test',
        'postgres',
        '',
        {
          host: '127.0.0.1',
          dialect: 'postgres',
        }
      );

      seq.Model = seq.instance.define('stubModel', seq.Schema);

      seq.instance.sync()
        .success(done)
        .error(done);
    });
  });
};

/**
 * Nuke the stub database.
 *
 * @param  {Function} done callback
 * @return {[type]}        [description]
 */
seq.nukedb = function(done) {
  // perform drop db
  seq.Model.destroy().success(done).error(done);
};
