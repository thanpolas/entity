/**
 * @fileOverview Bootstraps all tests for core and drivers
 */

var mongStub = require('../lib/mongoose-stub');
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
    Entity.Mongoose, // test major num: 2
  ];

  suite('E.', function() {
    setup(function(done) {
      mongStub.connect(function(err) {
        if (err) {return done(err);}

        mongStub.nukedb(done);
      });
    });

    // Test CRUD interface
    testEntity.surface(Entity.CrudIface, 1);
    testEntity.iface(Entity.CrudIface, 1);

    // Then all drivers
    var count = 2;
    drivers.forEach(function(Driver) {
      testEntity.surface(Driver, count);
      testDrivers.crud(Driver, count);
      count++;
    });

  });
};

// ignite
core.init();
