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
      ent = driver.factory().getInstance();
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


    switch(driver.name) {
    case 'Mongoose':
      suite(majNum + '.9.10 Mongoose specific tests', function() {
        test(majNum + '.9.10.1 Expect specific number of keys', function() {
          assert.lengthOf(ent.getSchema(), 4, 'Mongoose schema items');
        });
        test(majNum + '.9.10.2 Expect special keys to cannot show', function() {
          var schema = ent.getSchema();
          assert.deepPropertyVal(schema, '__v.canShow', false);
          assert.deepPropertyVal(schema, '_id.canShow', false);
        });
      });
      break;
    case 'Sequelize':
      suite(majNum + '.9.11 Sequelize specific tests', function() {
        test(majNum + '.9.11.1 Expect specific number of keys', function() {
          assert.lengthOf(ent.getSchema(), 4);
        });
        test(majNum + '.9.11.2 Expect special keys to cannot show', function() {
          var schema = ent.getSchema();
          assert.deepPropertyVal(schema, 'createdAt.canShow', false);
          assert.deepPropertyVal(schema, 'updatedAt.canShow', false);
        });
      });
      break;
    }
  });
};
