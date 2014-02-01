/**
 * @fileOverview Bootstraps all tests for core and drivers
 */

var mongStub = require('../lib/mongoose-stub');
var seqStub = require('../lib/sequelize-stub');
var entity = require('../..');
var testDriverUtils = require('./drivers.test');
var testDriverCreate = require('./drivers-create.test');
var testDriverRead = require('./drivers-read.test');
var testDriverUpdate = require('./drivers-update.test');
var testDriverDelete = require('./drivers-delete.test');
var testDriverSchema = require('./drivers-schema.test');

var core = module.exports = {};

/**
 * Get going
 *
 */
core.init = function() {

  var drivers = [
    {
      name: 'Mongoose',
      entity: entity.mongoose,
      majNum: '10',
      stub: mongStub,
      factory: function() {
        var entMong = entity.mongoose.extend();
        entMong.setModel(mongStub.Model);
        return entMong;
      },
    },
    {
      name: 'Sequelize',
      entity: entity.sequelize,
      majNum: '11',
      stub: seqStub,
      factory: function() {
        var entSeq = entity.sequelize.extend();
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
  drivers.forEach(function(driver) {
    suite(driver.majNum + '. ' + driver.name + ' driver', function() {
      setup(function(done) {
        driver.stub.connect(function(err) {
          if (err) {return done(err);}
          driver.stub.nukedb(done);
        });
      });
      teardown(function(done) {
        done();
      });

      testDriverUtils(driver, driver.majNum);
      testDriverCreate(driver, driver.majNum);
      testDriverRead(driver, driver.majNum);
      testDriverUpdate(driver, driver.majNum);
      testDriverDelete(driver, driver.majNum);
      testDriverSchema(driver, driver.majNum);
    });
  });
};

// ignite
core.init();
