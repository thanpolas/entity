/**
 * @fileOverview Bootstraps all tests for core and drivers
 */

var mongStub = require('../lib/mongoose-stub');
var seqStub = require('../lib/sequelize-stub');
var Entity = require('../..');
var testEntity = require('./entity.test');
var testDrivers = require('./drivers.test');

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
    suite(driver.majNum + '. ' + driver.name, function() {
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
      testDrivers.crud(driver, driver.majNum);

    });
  });
};

// ignite
core.init();
