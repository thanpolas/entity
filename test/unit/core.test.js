/**
 * @fileOverview Bootstraps all tests for core and drivers
 */

var mongStub = require('../lib/mongoose-stub');
var seqStub = require('../lib/sequelize-stub');
var Entity = require('../..');
var testEntity = require('./entity.test');
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
      Entity: Entity.Mongoose,
      majNum: '2',
      stub: mongStub,
      factory: function() {
        return new Entity.Mongoose(mongStub.Model);
      },
    },
    {
      name: 'Sequelize',
      Entity: Entity.Sequelize,
      majNum: '3',
      stub: seqStub,
      factory: function() {
        return new Entity.Sequelize(seqStub.Model);
      },
    },
  ];



  // Test CRUD interface
  function factoryCrud() {return new Entity.CrudIface();}
  testEntity.surface({factory: factoryCrud}, 1);
  testEntity.iface({factory: factoryCrud}, 1);

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


      testEntity.surface(driver, driver.majNum);
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
