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
      var schema = ent.getSchema();

      assert.property(schema, 'name');
      assert.property(schema, '_isActive');
      assert.deepPropertyVal(schema, 'name.canShow', true);
      assert.deepPropertyVal(schema, '_isActive.canShow', false);
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
