/**
 * @fileOverview bootstrap file.
 */

// protect the core
var entity = module.exports = require('./lib/entity');

entity.CrudIface = require('./lib/entity-crud');
entity.Mongoose = require('./adaptors/mongoose.adp');
entity.Sequelize = require('./adaptors/sequelize.adp');
