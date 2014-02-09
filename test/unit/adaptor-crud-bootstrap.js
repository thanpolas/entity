/**
 * @fileOverview Bootstraps all tests for core and drivers
 */

var mongStub = require('../lib/mongoose-stub');
var seqStub = require('../lib/sequelize-stub');
var Entity = require('../..');
var testAdaptorUtils = require('./adaptor-crud-main.test');
var testAdaptorCreate = require('./adaptor-crud-create.test');
var testAdaptorRead = require('./adaptor-crud-read.test');
var testAdaptorUpdate = require('./adaptor-crud-update.test');
var testAdaptorDelete = require('./adaptor-crud-delete.test');
var testAdaptorSchema = require('./adaptor-crud-schema.test');

var core = module.exports = {};

/**
 * Get going
 *
 */
core.init = function() {

  var adaptors = [
    {
      name: 'Mongoose',
      Entity: Entity.Mongoose,
      majNum: '10',
      stub: mongStub,
      factory: function() {
        var entMong = Entity.Mongoose.extend().getInstance();
        entMong.setModel(mongStub.Model);
        return entMong;
      },
    },
    {
      name: 'Sequelize',
      Entity: Entity.Sequelize,
      majNum: '11',
      stub: seqStub,
      factory: function() {
        var entSeq = Entity.Sequelize.extend().getInstance();
        entSeq.setModel(seqStub.Model);
        return entSeq;
      },
    },
  ];



  // Test CRUD interface
  // function factoryCrud() {return new Entity.CrudIface();}
  // testEntity.surface({factory: factoryCrud}, 1);
  // testEntity.iface({factory: factoryCrud}, 1);

  // Then all drivers
  adaptors.forEach(function(adaptor) {
    suite(adaptor.majNum + '. ' + adaptor.name + ' adaptor', function() {
      setup(function(done) {
        adaptor.stub.connect(function(err) {
          if (err) {return done(err);}
          adaptor.stub.nukedb(done);
        });
      });
      teardown(function(done) {
        done();
      });

      testAdaptorUtils(adaptor, adaptor.majNum);
      testAdaptorCreate(adaptor, adaptor.majNum);
      testAdaptorRead(adaptor, adaptor.majNum);
      testAdaptorUpdate(adaptor, adaptor.majNum);
      testAdaptorDelete(adaptor, adaptor.majNum);
      testAdaptorSchema(adaptor, adaptor.majNum);
    });
  });
};

// ignite
core.init();
