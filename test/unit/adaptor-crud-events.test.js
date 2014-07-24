/**
 * @fileOverview CRUD Events emitted by the entity.
 */

// var sinon  = require('sinon');
var chai = require('chai');
// var sinon = require('sinon');
var assert = chai.assert;

var fix = require('../fixture/data.fix');

// var noop = function(){};

/**
 * Test CRUD UPDATE methods.
 *
 * @param {Object} adaptor The adaptor object as defined in core.test.js
 */
module.exports = function(adaptor) {
  suite(adaptor.name + ' Events emitted', function() {
    setup(function() {
      this.entity = adaptor.factory();
    });

    test('Create operation event', function(done) {
      this.entity.on('create', function(src, result) {
        assert.equal(result.name, fix.one.name, 'Name should be the same');
        assert.equal(result._isActive, fix.one._isActive, 'isActive should be the same');
        done();
      });
      this.entity.create(fix.one);
    });
    test('Update operation event', function(done) {
      var self = this;
      this.entity.create(fix.one)
        .bind(this)
        .then(function(item) {
          this.entity.on('update', function(query, optResult) {
            if (adaptor.name === 'Mongoose') {
              assert.equal(optResult.name, 'new value',
                'Name should have been updated on returned object');
            }
            // perform a read
            self.entity.readOne(item.id).then(function(res) {
              assert.equal(res.name, 'new value', 'Name should have been updated on read');
            }).then(done, done);
          });
          this.entity.update(item.id, {name: 'new value'});
        });
    });
    test('Delete operation event', function(done) {
      this.entity.create(fix.one)
        .bind(this)
        .then(function(item) {
          this.entity.on('delete', function(query, itemId) {
            assert.equal(itemId, item.id, 'Delete event should provide the id');
            done();
          });

          this.entity.delete(item.id);
        });
    });
  });
};
