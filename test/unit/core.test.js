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
      Entity: Entity.Mongoose,
      majNum: '2',
      stub: mongStub
    },
    {
      Entity: Entity.Sequelize,
      majNum: '3',
      stub: seqStub
    },
  ];

  suite('E.', function() {
    // the spiral of death
    setup(function(done) {
      mongStub.connect(function(err) {
        if (err) {return done(err);}
        mongStub.nukedb(function(err){
          if (err) {return done(err);}
          seqStub.connect(function(err) {
            if (err) {return done(err);}
            seqStub.nukedb(done);
          });
        });
      });
    });

    // Test CRUD interface
    testEntity.surface(Entity.CrudIface, 1);
    testEntity.iface(Entity.CrudIface, 1);

    // Then all drivers
    drivers.forEach(function(driver) {
      testEntity.surface(driver.Entity, driver.stub.Model, driver.majNum);
      testDrivers.crud(driver.Entity, driver.stub.Model, driver.majNum);
    });

  });
};

// ignite
core.init();
