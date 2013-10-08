/**
 * @fileOverview Testing the drivers implementation.
 */

// var sinon  = require('sinon');
var chai = require('chai');
var sinon = require('sinon');
var assert = chai.assert;

var fix = require('../fixture/data.fix');
// var noop = function(){};

var tests = module.exports = {};

/**
 * Test CRUD methods.
 *
 * @param {Entity} Entity DI for the entity implementation.
 * @param {string} majNum The Major number.
 */
tests.crud = function(Entity, majNum) {
  suite(majNum + '.3 Create records', function() {
    var ent;
    setup(function() {
      ent = new Entity();
    });
    test(majNum + '.3.1 Create a record', function(done) {
      ent.create(fix.one, function(err, data) {
        assert.notInstanceOf(err, Error, 'Should have no error');
        assert.deepEqual(data, fix.one, 'Should return the provided fixture object');
        done();
      });
    });
  });

  suite(majNum + '.4 Update records', function() {
    var ent, id;
    setup(function(done) {
      ent = new Entity();
      ent.create(fix.one, function(err, obj) {
        if (err) {return done(err);}
        id = obj.id;
        done();
      });
    });

    test(majNum + '.4.1 Update a record using the id', function(done) {
      var newVal = 'new value';
      ent.update(id, {name: newVal}, function(err, obj) {
        if (err) {return done(err);}
        assert.equal(obj.name, newVal, 'Name should have been updated on returned object');
        // perform a read
        ent.readOne(id, function(err, res) {
          assert.equal(res.name, newVal, 'Name should have been updated on read');
          done();
        });
      });
    });
    test(majNum + '.4.2 Update a record using custom query', function(done) {
      var newVal = 'new value';
      ent.update({name: fix.one.name}, {name: newVal}, function(err, obj) {
        if (err) {return done(err);}
        assert.equal(obj.name, newVal, 'Name should have been updated on returned object');
        // perform a read
        ent.readOne(id, function(err, res) {
          assert.equal(res.name, newVal, 'Name should have been updated on read');
          done();
        });
      });
    });
  });


  suite(majNum + '.5 Read records', function() {
    var ent, id;
    setup(function(done) {
      ent = new Entity();
      ent.create(fix.one, function(err, obj) {
        if (err) {return done(err);}
        id = obj.id;

        ent.create(fix.two, done);
      });
    });

    test(majNum + '.5.1 Read one record using the id', function(done) {
      ent.readOne(id, function(err, res) {
        assert.equal(res.name, fix.one.name, 'Name should be the same');
        done();
      });
    });
    test(majNum + '.5.2 Read one record using custom query', function(done) {
      ent.readOne({name: fix.one.name}, function(err, res) {
        assert.equal(res.name, fix.one.name, 'Name should be the same');
        done();
      });
    });
    test(majNum + '.5.3 Read all records', function(done) {
      ent.read(function(err, res) {
        assert.equal(res.length, 2, 'There should be two results');
        assert.equal(res[0].name, fix.one.name, 'Name should be the same');
        done();
      });
    });
    test(majNum + '.5.4 Read limited set of records', function(done) {
      ent.readLimit(null, 0, 1, function(err, res) {
        assert.equal(res.length, 1, 'There should be one result');
        assert.equal(res[0].name, fix.one.name, 'Name should be the same');
        done();
      });
    });
  });

  suite(majNum + '.6 Count records', function() {
    var ent, id;
    setup(function(done) {
      ent = new Entity();
      ent.create(fix.one, function(err, obj) {
        if (err) {return done(err);}
        id = obj.id;

        ent.create(fix.two, done);
      });
    });
    test(majNum + '.6.1 Count records', function(done) {
      ent.count(function(err, count) {
        assert.equal(count, 2, 'There should be two results');
        done();
      });
    });
  });
};
