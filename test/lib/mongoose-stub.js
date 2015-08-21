/**
 * @fileOverview Stub a mongoose model.
 */
var __ = require('lodash');

var mongoose = require('mongoose');
var Promise = require('bluebird');

var Entity = require('../..');
var fix = require('../fixture/data.fix');

var mong = module.exports = {};

var _init = false;

/**
 * Define the mong schema
 * @type {Object}
 */
mong.Schema = {
  name: {type: String, trim: true, required: true},
  sortby: {type: Number},
  _isActive: {type: Boolean, required: true, default: true},
};

/**
 * Define the mong schema related to the original
 * @type {Object}
 */
mong.SchemaRel = {
  darname: {type: String},
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'stubModel',
  },
};

/** @type {?Mongoose.Model} */
mong.Model = null;

/**
 * Initialize all the models.
 *
 * @private
 */
mong._initModels = function() {
  // init schemas
  mong.schema = new mongoose.Schema(mong.Schema);
  mong.schemaRel = new mongoose.Schema(mong.SchemaRel);

  // init models
  mong.Model = mongoose.model('stubModel', mong.schema);
  mong.ModelRel = mongoose.model('stubModelRel', mong.schemaRel);
};

/**
 * Nuke the stub database.
 *
 * @param  {Function} done callback
 */
mong.nukedb = function(done) {
  // perform drop db
  mongoose.connection.db.dropDatabase(done);
};

/**
 * Create a connection with mongo.
 *
 * @param {Function(Error=)} done Optionally define a callback.
 */
mong.connect = function(done) {
  if (_init) {return done();}
  _init = true;

  // check if already connected
  if (1 === mongoose.connection.readyState) {
    done();
    return;
  }

  // http://mongoosejs.com/docs/connections.html
  var mongoUri = 'mongodb://127.0.0.1/crude-test';
  var mongoOpts = {
    server: {
      socketOptions: {
        keepAlive: 1
      }
    }
  };

  mongoose.connect(mongoUri, mongoOpts);
  var db = mongoose.connection.db;

  // rather silly callback mechanism.
  var cbDone = false;
  function onErrorLocal(err) {
    if (cbDone) {return;}
    cbDone = true;
    db.removeListener('open', onOpenLocal);
    done(err);
  }
  function onOpenLocal() {
    if (cbDone) {return;}
    cbDone = true;
    db.removeListener('error', onErrorLocal);

    mong._initModels();
    done();
  }


  mongoose.connection.once('error', onErrorLocal);
  mongoose.connection.once('open', onOpenLocal);
  // setup global mongoose event error handler
  mongoose.connection.on('error', function(err) {
    console.error('Mongoose ERROR:', err);
    throw err;
  });
};

/**
 * Setup and teardown records for testing.
 *
 */
mong.setupRecords = function() {
  setup(function() {
    var EntMong = Entity.Mongoose.extend();
    this.entity = new EntMong();
    this.entity.setModel(mong.Model);

    var EntRelMong = Entity.Mongoose.extend();
    this.entityRel = new EntRelMong();
    this.entityRel.setModel(mong.ModelRel);
    this.entityRel.eagerLoad('parent');
  });
  setup(function() {
    return Promise.all([
      this.entity.create(fix.one),
      this.entity.create(fix.two),
    ])
      .bind(this)
      .then(function(res) {
        this.recordOne = res[0];
        this.recordTwo = res[1];
      });
  });
  setup(function() {
    var fixOne = __.clone(fix.relOne);
    var fixTwo = __.clone(fix.relTwo);
    fixOne.parent = this.recordOne._id;
    fixTwo.parent = this.recordTwo._id;

    return Promise.all([
      this.entityRel.create(fixOne),
      this.entityRel.create(fixTwo),
    ])
      .bind(this)
      .then(function(res) {
        this.recordRelOne = res[0];
        this.recordRelTwo = res[1];
      });
  });

  teardown(function() {
    return Promise.all([
      this.entity.delete(),
      this.entityRel.delete(),
    ]);
  });
};
