/**
 * @fileOverview bootstrap file.
 */

// protect the core
var entity = module.exports = {};

entity.constructor = require('./lib/entity');
entity.extend = entity.constructor.extend;

entity.crudIface = require('./lib/entity-crud');
entity.mongoose = require('./adaptors/mongoose.adp');
entity.sequelize = require('./adaptors/sequelize.adp');
