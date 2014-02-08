/**
 * @fileOverview bootstrap file.
 */

// protect the core
var entity = module.exports = {};

entity.constructor = require('./lib/entity');
entity.extend = entity.constructor.extend;

entity.CrudIface = require('./lib/entity-crud');
entity.Mongoose = require('./adaptors/mongoose.adp');
entity.Sequelize = require('./adaptors/sequelize.adp');
