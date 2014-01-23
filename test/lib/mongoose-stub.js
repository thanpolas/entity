/**
 * @fileOverview Stub a mongoose model.
 */

var mongoose = require('mongoose');

var mong = module.exports = {};

var _init = false;

/**
 * Define the mong schema
 * @type {Object}
 */
mong.Schema = {
  name: {type: String, trim: true, required: true},
  _isActive: {type: Boolean, required: true, default: true},
};

/** @type {?Mongoose.Model} */
mong.Model = null;

/**
 * Initialize all the models.
 *
 * @private
 */
mong._initModels = function() {
  // init schema
  mong.schema = new mongoose.Schema(mong.Schema);
  // init model
  mong.Model = mongoose.model('stubModel', mong.schema);
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
