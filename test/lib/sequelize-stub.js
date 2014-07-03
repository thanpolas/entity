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
  name: {type: Sequelize.STRING, allowNull: false},
  _isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true},
};

/**
 * Define the seq schema relation
 * @type {Object}
 */
seq.SchemaRel = {
  darname: {type: Sequelize.STRING, allowNull: false},
};

/** @type {?Sequelize} The main Sequelize instance */
seq.instance = null;

/** @type {?Sequelize.Model} The sequelize model */
seq.Model = null;

/** @type {?Sequelize.Model} The sequelize model related */
seq.ModelRel = null;

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
          logging: false,
        }
      );

      seq.Model = seq.instance.define('stubModel', seq.Schema);
      seq.ModelRel = seq.instance.define('stubModelRel', seq.SchemaRel);
      seq.Model.hasMany(seq.ModelRel);

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
