/**
 * @fileOverview bootstrap file.
 */

var entity = module.exports = require('./entity');

entity.CrudIface = require('./entity-crud');
entity.Mongoose = require('./adaptors/mongoose.adp');
entity.Sequelize = require('./adaptors/sequelize.adp');
