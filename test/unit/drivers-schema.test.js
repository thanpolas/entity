/**
 * @fileOverview Testing the drivers implementation.
 */

// var sinon  = require('sinon');
var chai = require('chai');
// var sinon = require('sinon');
var assert = chai.assert;

var fix = require('../fixture/data.fix');

// var noop = function(){};

/**
 * Test CRUD READ methods.
 *
 * @param {Object} driver The driver object as defined in core.test.js
 * @param {string} majNum The Major number.
 */
module.exports = function(driver, majNum) {

  suite(majNum + '.9 Schema exporting', function() {
    var ent, id;
    setup(function(done) {
      ent = driver.factory();
      ent.create(fix.one, function(err, obj) {
        if (err) {return done(err);}
        id = obj.id;

        ent.create(fix.two, done);
      });
    });
    test(majNum + '.9.1 Look for expected keys in Schema', function() {
      var foundName = false;
      var foundisActive = false;

      var schema = ent.getSchema();
      schema.forEach(function(schemaItem){
        if (schemaItem.name === 'name') {
          foundName = true;
          assert.ok(schemaItem.canShow, '"name" should have "canShow" true');
        }
        if (schemaItem.name === '_isActive') {
          foundisActive = true;
          assert.notOk(schemaItem.canShow, '"_isActive" should have "canShow" false');
        }
      });

      assert.ok(foundName, '"name" was included in schema');
      assert.ok(foundisActive, '"_isActive" was included in schema');
    });

    if (driver.name === 'Mongoose') {
      suite(majNum + '.9.10 Mongoose specific tests', function() {
        test(majNum + '.9.10.1 Expect specific number of keys', function() {
          assert.lengthOf(ent.getSchema(), 4, 'Mongoose schema items');
        });
      });
    }

  });
};
