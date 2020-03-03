/**
 * @fileOverview Testing the adaptors implementation.
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
 * @param {Object} adaptor The adaptor object as defined in core.test.js
 * @param {string} majNum The Major number.
 */
module.exports = function(adaptor, majNum) {

  suite(majNum + '.9 Schema exporting', function() {
    var ent, id;
    setup(function(done) {
      ent = adaptor.factory();
      ent.create(fix.one).then(function(obj) {
        id = obj.id;
        ent.create(fix.two).then(done.bind(null, null), done);
      }).then(null, done);
    });

    test(majNum + '.9.1 Look for expected getSchema() return value type', function() {
      var schema = ent.getSchema();
      assert.notOk(Array.isArray(schema));
      assert.isObject(schema);
    });
    test(majNum + '.9.2 Look for expected keys in Schema', function() {
      var schema = ent.getSchema();
      assert.property(schema, 'name');
      assert.property(schema, '_isActive');
      assert.propertyVal(schema.name, 'canShow', true);
      assert.propertyVal(schema._isActive, 'canShow', false);
    });


    switch(adaptor.name) {
    case 'Mongoose':
      suite(majNum + '.9.10 Mongoose specific tests', function() {
        test(majNum + '.9.10.1 Expect specific number of keys', function() {
          assert.lengthOf(Object.keys(ent.getSchema()), 5, 'Mongoose schema items');
        });
        test(majNum + '.9.10.2 Expect special keys to cannot show', function() {
          var schema = ent.getSchema();
          assert.propertyVal(schema.__v, 'canShow', false);
          assert.propertyVal(schema._id, 'canShow', false);
        });
      });
      break;
    case 'Sequelize':
      suite(majNum + '.9.11 Sequelize specific tests', function() {
        test(majNum + '.9.11.1 Expect specific number of keys', function() {
          assert.lengthOf(Object.keys(ent.getSchema()), 6);
        });
        test(majNum + '.9.11.2 Expect special keys to cannot show', function() {
          var schema = ent.getSchema();
          assert.propertyVal(schema.createdAt, 'canShow', false);
          assert.propertyVal(schema.updatedAt, 'canShow', false);
        });
      });
      break;
    }
  });
};
