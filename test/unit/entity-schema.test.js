/**
 * @fileOverview Testing the Entity CRUD interface.
 */

// var sinon  = require('sinon');
var chai = require('chai');
// var sinon = require('sinon');
var assert = chai.assert;

var entity = require('../../');


// var noop = function(){};

setup(function() {});
teardown(function() {});


// The numbering (e.g. 1.1.1) has nothing to do with order
// The purpose is to provide a unique string so specific tests are
// run by using the mocha --grep "1.1.1" option.

var schema1 = {
  firstName: {
    type: 'string',
  },
  lastName: {
    type: 'string',
  },
};

suite('5.2 Entity Schema', function() {
  var Ent, ent;
  setup(function() {
    Ent = entity.extend();
    ent = new Ent();
  });
  suite('5.2.1 Entity Schema Add / Get / Rem', function() {
    test('5.2.1.1 Entity.addSchema() using an object', function() {
      ent.addSchema(schema1);

      var schema = ent.getSchema();
      assert.property(schema, 'firstName');
      assert.property(schema, 'lastName');
    });
    test('5.2.1.1.2 Entity.addSchema() using an object appends', function() {
      ent.addSchema(schema1);
      ent.addSchema({
        age: {
          type: 'number',
        },
      });
      var schema = ent.getSchema();
      assert.property(schema, 'firstName');
      assert.property(schema, 'lastName');
      assert.property(schema, 'age');
    });
    test('5.2.1.1.3 Entity.addSchema() using an object and [type] string as value', function() {
      ent.addSchema({
        firstName: 'string',
        lastName: 'string',
        age: 'number',
      });
      var schema = ent.getSchema();
      assert.property(schema, 'firstName');
      assert.property(schema, 'lastName');
      assert.property(schema, 'age');
      assert.deepPropertyVal(schema, 'firstName.type', 'string');
      assert.deepPropertyVal(schema, 'lastName.type', 'string');
      assert.deepPropertyVal(schema, 'age.type', 'number');
    });



    test('5.2.1.2 Entity.addSchema() using key and object', function() {
      ent.addSchema('firstName', {type: 'string'});
      ent.addSchema('lastName', {type: 'string'});
      var schema = ent.getSchema();
      assert.property(schema, 'firstName');
      assert.property(schema, 'lastName');
    });
    test('5.2.1.3 Entity.addSchema() can be chained', function() {
      ent.addSchema('firstName', {type: 'string'})
        .addSchema('lastName', {type: 'string'});
      var schema = ent.getSchema();
      assert.property(schema, 'firstName');
      assert.property(schema, 'lastName');
    });
    test('5.2.1.3.2 Entity.addSchema() accepts a string (representing type) as second argument', function() {
      var schema = ent.addSchema('firstName', 'string')
        .addSchema('lastName', 'string')
        .addSchema('age', 'number')
        .getSchema();

      assert.property(schema, 'firstName');
      assert.property(schema, 'lastName');
      assert.deepPropertyVal(schema, 'firstName.type', 'string');
      assert.deepPropertyVal(schema, 'lastName.type', 'string');
      assert.deepPropertyVal(schema, 'age.type', 'number');
    });


    test('5.2.1.4 Entity.getSchema() default values', function() {
      ent.addSchema(schema1);
      var schema = ent.getSchema();
      assert.isObject(schema);
      assert.deepPropertyVal(schema, 'firstName.name', 'firstName');
      assert.deepPropertyVal(schema, 'firstName.path', 'firstName');
      assert.deepPropertyVal(schema, 'firstName.canShow', true);
      assert.deepPropertyVal(schema, 'firstName.type', 'string');
    });


    test('5.2.1.5 Entity.remSchema() does not affect passed object', function() {
      ent.addSchema(schema1);
      ent.remSchema('lastName');
      assert.property(schema1, 'lastName');
    });
    test('5.2.1.6 Entity.remSchema() removes attribute', function() {
      ent.addSchema(schema1);
      ent.remSchema('lastName');
      var schema = ent.getSchema();
      assert.notProperty(schema, 'lastName');
    });
    test('5.2.1.7 Entity.remSchema() can be chained', function() {
      var schema = ent.addSchema(schema1)
        .remSchema('lastName')
        .remSchema('firstName')
        .getSchema();
      assert.notProperty(schema, 'lastName');
      assert.notProperty(schema, 'firstName');
    });
  });



  suite('5.2.2 Entity Schema inheritance behavior', function() {
    test('5.2.2.1 Extended entity with schema defined does not inherits', function() {
      ent.addSchema(schema1);
      var ChildEnd = Ent.extend();
      var childEnt = new ChildEnd();
      var schema = childEnt.getSchema();
      assert.notProperty(schema, 'firstName');
      assert.notProperty(schema, 'lastName');
    });
    test('5.2.2.2 Adding schema items to extended entity does not affect parent', function() {
      ent.addSchema(schema1);
      var ChildEnd = Ent.extend();
      var childEnt = new ChildEnd();

      childEnt.addSchema('age', 'number');
      var schema = ent.getSchema();
      var childSchema = childEnt.getSchema();

      assert.property(childSchema, 'age');
      assert.notProperty(schema, 'age');
    });
  });
});
