/**
 * @fileOverview The normalized schema of an Entity, expressed using mschema.
 * @see  https://github.com/mschema/mschema
 */

module.exports = [{
  // The canonical name of the key i.e. "firstName"
  name: 'string',
  // In cases of nested objects this represents the full path to the key
  // i.e. "user.firstName"
  path: 'string',
  // Defines if this key can be viewed in public
  canShow: 'boolean',
}];
