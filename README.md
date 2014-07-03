# Entity

An Entity is a business unit. Entities are supersets of models, resources and contain the business logic. They are persistent storage agnostic and provide a normalized API with which your consuming services can perform business logic actions.

![Entity Figure 1](https://docs.google.com/drawings/d/1gCV3jmHVK8jJcH40dmUJ6-iZU9YdKixW9YPQ5kHj-As/pub?w=331&h=289)

[![Build Status](https://travis-ci.org/thanpolas/entity.png)](https://travis-ci.org/thanpolas/entity)

The Entity Object on itself is nothing but an extension of `EventEmitter`. It can be easily extended to create the Interfaces and base classes from where your business logic entities can inherit.

Currently the CRUD interface has been implemented and two ORM packages are supported in the form of Adaptors, [Mongoose][] and [Sequelize][].

## Install

```shell
npm install node-entity --save
```

## Entity Static Methods

Entity uses the [Cip][] package for inheritance, it implements the pseudo-classical inheritance pattern packed in a convenient and easy to use API. Extend will create a new Constructor that can be invoked with the `new` keyword or itself extended using the same static method. All the static methods related to inheritance are from Cip.

### entity.extend()

The `extend()` method is the basic tool for extending, it accepts a constructor.

```js
var entity = require('entity');

var EntityChild = entity.extend(function() {
  this.a = 1;
});

var EntityGrandChild = EntityChild.extend();

var EntityGreatGrandChild = EntityGrandChild.extend(function() {
  this.b = 2;
});

var greatGrandChild = new EntityGreatGrandChild();

greatGrandChild.a === 1; // true
greatGrandChild.b === 2; // true

```
Read more about [extend() at Cip's documentation](https://github.com/thanpolas/cip#extend-create-a-new-constructor).

### entity.getInstance()

The `getInstance()` method will return a singleton instance. This means that you will get the same exact instance every time you invoke this static function.

```js
var entityChild = require('../entities/child.ent').getInstance();
```

While the use of singletons has been fairly criticized, it is our view that in modern day web applications, the *instance* role has moved up to the node process. Your web application will naturally run on multiple cores (instances) and thus each instance is a single unit in the whole that comprises your web service. Entities need to emit and listen to local events, PubSub, create Jobs, send email and generally have bindings to other services (RPC, AWS, whatnot).

Those events, PubSub etc have a lifetime equal to the runtime of the core the application is running on. This requires for a single entity to exist and manage all those bindings, applying the business logic and performing the required high level operations.


## Entity CRUD Interface

The current implementation offers a normalized CRUD Interface with a selected set of operations. The purpose of having a normalized interface is to decouple the business logic from storage, models. ORM Adaptors implement the CRUD Interface giving you a vast array of options for the underlying persistent storage. As mentioned above, currently two ORM packages are supported, [Mongoose][] and [Sequelize][]. This pretty much covers all the popular databases like mongodb, Postgres, MySQL, Redis, SQLite and MariaDB.

### CRUD Primitive Operations

The CRUD Interface offers the following primitive operations:

  * **create**(data)
  * **read**(query=)
  * **readOne**(query)
  * **readLimit**(?query, offset, limit)
  * **update**(query, updateValues)
  * **delete**(query)
  * **count**(query=)

These primitives will transparently adapt to the most optimized operations on the ORM of your choosing and guarantee the outcome will always be the same no matter the underlying ORM.

All primitive methods offer Before/After hooks and return a Promise to determine resolution.

#### entity.create(data)

* **data** `Object` The Data Object representing the Entity you wish created.
* Returns `Object` The newly created item, in the type of the underlying ORM.

The `create()` method will create a new item, you need to provide an Object containing key/value pairs.

```js
entity.create({name: 'thanasis'})
  .then(function(document) {
    document.name === 'thanasis'; // true
  }, then(function(error) {
    // deal with error.
  });
```

[Check out the `entity.create()` tests](https://github.com/thanpolas/entity/blob/master/test/unit/adaptor-crud-create.test.js)


#### entity.read(query=)

* **query=** `Object|string` *Optional* A query or an id.
* Returns `Array.<Object>` An array of documents.

The `read()` method will query for items. If the query argument is omitted, all the items will be returned. If the *query* argument is an Object, it will be passed as is to the underlying ORM. Entity guarantees that key/value type queries will work and will also transport any idiomatic ORM query types.

```js
entity.read().then(function(documents) {
  // All documents
});

entity.read({networkId: '47'}).then(function(documents) {
  // All documents whose "networkId" equals 47
});
```

Any additional key/value pairs you add to your query will be added with the `AND` operator.

##### Query supports expressions

The query for the `read()` method supports any of the `gt, gte, lt, lte, ne` by using an Object literal as the value for the attribute you want to query:

```js
entity.read({
  name: 'sam',
  age: {
    gt: 8
  },
  attr3: {
    lte: 10
  }
});
```

[Check out the `entity.read()` tests](https://github.com/thanpolas/entity/blob/master/test/unit/adaptor-crud-read.test.js)

#### entity.readOne(query)

* **query** `Object|string` A query or an id, required.
* Returns `Object` A single Document.

The `readOne()` method guarantees that you will get one and only one item. It is the method intended to be used by single item views. The *query* argument has the same attributes as `read()`.

```js
entity.read({name: 'thanasis'}).then(function(document) {
  document.name === 'thanasis'; // true
});

entity.read('42').then(function(document) {
  document.id === '42'; // true
});
```

#### entity.readLimit(?query, offset, limit)

* **query** `Object|string|null` A query or an id, if `null` will fetch all.
* **offset** `number` Starting position.
* **limit** `number` Number of items to fetch.
* Returns `Array.<Object>` An array of Documents.

Will fetch the items based on query, limiting the results by the offset and limit defined. The *query* argument shares the same attributes as `read()`, if `null` all the items will be fetched.

```js
entity.readLimit(null, 0, 10).then(function(documents) {
  // fetched the first 10 items
});

entity.readLimit({networkId: '42'}, 10, 10).then(function(documents) {
  // fetched records whose networkId equels '42
  // And started from the 10th item,
  // limiting the total records to 10
});
```

#### entity.update(query, updateValues)

* **query** `Object|string` A query or an id, required.
* **updateValues** `Object` An Object with key/value pairs to update.
* Returns `Object=` The updated document of Mongoose ORM is used or nothing if Sequelize.

Will perform an update operation on an item or set of item as defined by the query. The *query* argument can be a single id or an Object with key/value pairs.

```js
entity.update('99', {name: 'John').then(function(document) {
  document.name === 'John'; // true only for Mongoose
});

entity.update({networkId: '42'}, {isActive: false}).then(function(documents) {
  // deactive all items with network id that equals 42
});
```
[Check out the `entity.update()` tests](https://github.com/thanpolas/entity/blob/master/test/unit/adaptor-crud-update.test.js)

#### entity.delete(query)

* **query** `Object|string` A query or an id, required.
* Returns nothing.

Will perform an delete operation as defined by the query. The *query* argument can be a single id or an Object with key/value pairs.

```js
entity.delete('99').then(function() {
  // job done
});

entity.delete({networkId: '42'}).then(function() {
  // all gone
});
```

[Check out the `entity.delete()` tests](https://github.com/thanpolas/entity/blob/master/test/unit/adaptor-crud-delete.test.js)

#### entity.count(query=)

* **query=** `Object|string` *Optional* A query or an id, if omitted all items will be count.
* Returns `number` The count.

Will perform a count operation as defined by the query. The *query* argument can be a single id or an Object with key/value pairs, if empty it will count all the items.

```js
entity.count().then(function(count) {
  typeof count === 'number'; // true, all the items.
});

entity.count({networkId: '42'}).then(function() {
  typeof count === 'number'; // true
});
```

[Check out the `entity.count()` tests](https://github.com/thanpolas/entity/blob/master/test/unit/adaptor-crud-main.test.js)


### Before / After Hooks

Every CRUD operation offers Before/After hooks courtesy of [Middlewarify][]. Each middleware will receive the same exact arguments. To pass control to the next middleware you need to return a promise that conforms to the [Promises/A+ spec](http://promises-aplus.github.io/promises-spec/).


```js
// a middleware with synchronous resolution
entity.create.before(function(data){
  if (!data.name) {
    throw new TypeError('No go my friend');
  }
});

// then...
entity.create({}).then(function(document) {
  // you'll never get here
}, function(err) {
  err instanceof Error; // true
  err.message === 'No go my friend'; // true
});
```

An Asynchronous middleware

```js
// a middleware with synchronous resolution
entity.create.before(function(data){
  return somepackage.promise(function(resolve, reject) {
    // perform an async op
    readTheStars(function(err, omen) {
      if (err) { return reject(err); }

      if (omen === 'thou shall not pass') {
        reject('Meh');
      } else {
        resolve();
      }
    });
  });
});
```

### Setting up a CRUD Entity

The two currently available adaptors are available through these properties of the *entity* module

* `entity.Mongoose` For the [Mongoose ORM][mongoose]
* `entity.Sequelize` For the [Sequelize ORM][sequelize]

All adaptors expose the `setModel()` method. Before that method is successfully invoked all CRUD operations will fail, the Model required is an instantiated model of each respective ORM.

#### Initializing Mongoose

**models/user.model.js**

```js
var mongoose = require('mongoose');

var userModel = module.exports = {};
userModel.schema = new mongoose.Schema({
  name: {type: String, trim: true, required: true},
  _isActive: {type: Boolean, required: true, default: true},
});

// This module now exposes the Mongoose
// User model on the "Model" property
userModel.Model = mongoose.model('user', userModel.schema);
```

**entities/user.ent.js**

```js
var EntityMongoose = require('entity').Mongoose;
var UserModel = require('../models/user.model');

var UserEntity = module.exports = Entity.Mongoose.extend(function(){
  // pass the Mongoose User Model
  this.setModel(UserModel.Model);
});
```

#### Initializing Sequelize

**models/user.model.js**

```js
var Sequelize = require('sequelize');

// typically you have this in another module
var seqInstance = new Sequelize(
  'database',
  'postgres',
  '',
  {
    host: '127.0.0.1',
    port: '5432',
    dialect: 'postgres',
    logging: false,
  }
);

var userModel = module.exports = {};

// This module now exposes the Sequelize
// User model on the "Model" property
userModel.Model = seqInstance.define('user', {
  name: {type: Sequelize.STRING, allowNull: false},
  _isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true},
});
```

**entities/user.ent.js**

```js
var EntitySequelize = require('entity').Sequelize;
var UserModel = require('../models/user.model');

var UserEntity = module.exports = Entity.Sequelize.extend(function(){
  // pass the Sequelize User Model
  this.setModel(UserModel.Model);
});
```

That was it, from here on, irrespective of adaptor and ORM, you can instantiate a new entity or use the singleton to perform CRUD operations.

**controllers/user.ctrl.js**

```js
var BaseController = require('./base-controller.js');
var userEnt = require('../entities/user.ent').getInstance();

// The BaseController uses the "cip" package for inheritance
var UserCtrl = module.exports = BaseController.extend();

UserCtrl.prototype.createNew = function(req, res) {
  // pass the submited parameters
  // validation happens on the model.
  userEnt.create(req.body)
    .then(function(udo){
      // send the User Data Object
      res.json(udo);
    }, function(error) {
      res.json(501, error);
    });
};
```

## Entity Schema

Entities offer a schema API. CRUD Adaptors will automatically translate the underlying ORM's schema to a normalized [mschema][] compliant schema.

### entity.getSchema()

* Returns `mschema` The normalized schema.

`getSchema()` is synchronous, it will return a key/value dictionary where value will always contain the following properties

* **name** `string` The name of the attribute.
* **path** `string` The full path of the attribute (used by document stores)
* **canShow** `boolean` A boolean that determines View visibility.
* **type** `string` An [mschema][] type, possible types are:
  * `string`
  * `number`
  * `object`
  * `boolean`
  * `any`

```js
var userModel = require('../entities/user.ent').getInstance();

userModel.getSchema();
```

Outputs:

```json
{
  "name": {
    "name": "name",
    "path": "name",
    "canShow": true,
    "type": "string"
  },
  "_isActive": {
    "name": "_isActive",
    "path": "_isActive",
    "canShow": false,
    "type": "boolean"
  }
}
```

The `path` property will be useful when you use nested Objects in your Schema, something only possible with the Mongoose adaptor. So if the address is an object that contains the attribute `city` here's how that would look like:

```json
{
  "address.city": {
    "name": "city",
    "path": "address.city",
    "canShow": true,
    "type": "string"
  }
}
```

[Check out the CRUD Schema method tests](https://github.com/thanpolas/entity/blob/master/test/unit/adaptor-crud-schema.test.js)


#### entity.addSchema(attributeName, type)

* **attributeName** `Object|string` The name of the attribute to add or an Object with key/value pairs.
* **type** `Object|string` The type or an Object with key/value pairs representing the attributes values.
* Returns self, can be chained.

The `addSchema()` method allows you to add attributes to the entity's schema. Any of the following combinations are acceptable.

```js
entity.addSchema('name', 'string');
entity.addSchema('name', {type: 'string', cahShow: false});
entity.addSchema({
  name: 'string'
});
entity.addSchema({
  name: {
    type: 'string'
  }
});
```
#### entity.remSchema(attributeName)

* **attributeName** `string` The name of the attribute to remove.
* Returns self, can be chained.

Remove an attribute from the schema.

```js
entity.remSchema('name');
```
[Check out the Schema basic methods tests](https://github.com/thanpolas/entity/blob/master/test/unit/entity-schema.test.js)

## Release History

- **v0.2.9**, *03 Jul 2014*
  - optimizations and fixes on eager loading for mongoose.
- **v0.2.8**, *03 Jul 2014*
  - Introduce eager loading mechanisms.
- **v0.2.7**, *01 Jul 2014*
  - Mute mongoose cast to ID errors.
- **v0.2.6**, *27 Jun 2014*
  - support more complex queries using `between` selector.
- **v0.2.5**, *26 Jun 2014*
  - Now supports query expression `gt, gte, lt, lte, ne`
- **v0.2.4**, *22 Feb 2014*
  - Better handling of mongoose relation declarations when reading schema.
- **v0.2.3**, *17 Feb 2014*
  - Fixed bug on Sequelize adaptor that returned wrong type of value with `getSchema()`.
- **v0.2.2**, *17 Feb 2014*
  - Upgraded all package dependencies to latest.
- **v0.2.1**, *17 Feb 2014*
	- Upgrade to [cip][] 0.2.1
- **v0.2.0**, *17 Feb 2014*
  - Upgrade and integrade to [cip][] 0.2.0, replaces Inher.
- **v0.1.3**, *15 Feb 2014*
	- Upgrade Middlewarify to 0.3.3.
- **v0.1.2**, *12 Feb 2014*
  - Now casting to Bluebird promises all returned Objects from Sequelize adaptor.
- **v0.1.1**, *11 Feb 2014*
  - Added "main" key in package.json
- **v0.1.0**, *11 Feb 2014*
  - New API, documentation, Inher integration.
- **v0.0.1**, *08 Oct 2013*
  - Big Bang

## License

Copyright 2014 Thanasis Polychronakis

Licensed under the [MIT License](LICENSE-MIT)

[thanpolas]: https://github.com/thanpolas "Thanasis Polychronakis"
[Mongoose]: http://mongoosejs.com/
[Sequelize]: http://sequelizejs.com/
[Cip]: https://github.com/thanpolas/cip/
[Middlewarify]: https://github.com/thanpolas/middlewarify/
[mschema]: https://github.com/mschema/mschema/
