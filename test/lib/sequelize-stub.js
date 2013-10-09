/**
 * @fileOverview Stub a Sequelize model.
 */
var exec = require('child_process').exec;
var util = require('util');

var Sequelize = require('sequelize');

var seq = module.exports = {};

var _init = false;

/**
 * Define the seq schema
 * @type {Object}
 */
seq.Schema = {
  name: {type: Sequelize.STRING, allowNull: false},
  isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true},
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
          port: '5432',
          dialect: 'postgres',
        }
      );

      seq.Model = seq.instance.define('stubModel', seq.Schema);

      seq.nukedb(done);
    });
  });
};

/**
 * Nuke the stub database, force recreation.
 *
 * @param  {Function} done callback
 */
seq.nukedb = function(done) {
  seq.instance.sync({force: true})
    .success(done.bind(null, null))
    .error(done);
};
