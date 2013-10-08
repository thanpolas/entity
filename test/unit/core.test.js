/**
 * @fileOverview Bootstraps all tests for core and drivers
 */

var Entity = require('../..');
var MongDrv = require('../../drivers/mongoose.drv');

var testEntity = require('./entity.test');
var testDrivers = require('./drivers.test');

var core = module.exports = {};

/**
 * Get going
 *
 */
core.init = function() {

  var drivers = [
    MongDrv, // test major num: 2
  ];


  // Test core interface first
  testEntity.surface(Entity, 1);
  testEntity.iface(Entity, 1);

  // Then all drivers
  var count = 2;
  drivers.forEach(function(Driver) {
    testEntity.surface(Driver, count);
    testDrivers.crud(Driver, count);
    count++;
  });
};
