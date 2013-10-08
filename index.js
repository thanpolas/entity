/**
 * @fileOverview bootstrap file.
 */

var Entity = module.exports = require('./entity');

Entity.CrudIface = require('./entity-crud');
Entity.Mongoose = require('./drivers/mongoose.drv');
Entity.Sequelize = require('./drivers/sequelize.drv');
