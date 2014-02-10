# Entity

An Entity is a business unit. Entities are supersets of models, resources and contain the bussiness logic. They are persistent storage agnostic and provide a normalized API with which your consuming services can perform business logic actions.

![Entity Figure 1](https://docs.google.com/drawings/d/1gCV3jmHVK8jJcH40dmUJ6-iZU9YdKixW9YPQ5kHj-As/pub?w=331&amp;h=289)

[![Build Status](https://travis-ci.org/thanpolas/entity.png)](https://travis-ci.org/thanpolas/entity)

The Entity Object on itself is nothing but an extention of `EventEmitter`. It can be easily extented to create the Interfaces and base classes from where your business logic entities can inherit.

Currently the CRUD interface has been implemented and two ORM packages are supported in the form of Adaptors, [Mongoose][] and [Sequelize][].

## Install

```shell
npm install node-entity --save
```

## Entity Static Methods

Entity uses the [Inher][] package for inheritance, it implements the pseudo-classical inheritance pattern packed in a convenient and easy to use API. Extend will create a new Constructor that can be invoked with the `new` keyword or itself extended using the same static method. All the static methods related to inheritance are from Inher.

### entity.extend()

The `extend()` method is the basic tool of extending, it accepts a constructor.

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
Read more about [extend() at Inher's documentation](https://github.com/thanpolas/inher#extend-creates-new-children).

### entity.getInstance()

The `getInstance()` method will return a singleton instance. This means that you will get the same exact instance every time you invoke this static function.

```js
var entityChild = require('../entities/child.ent').getInstance();
```

While the use of singletons has been fairly critisized, it is our view that in modern day web applications, the *instance* role has moved up to the node process. Your web application will naturaly run on multiple cores (instances) and thus each instance is a single unit in the whole that comprizes what is your web service. Entities need to emit and listen to local events, Publish and Subscribe messages using a PubSub service and generaly have bindings to other services (RPC, AWS, whatnot).

Those event, pubsub and any other bindings have a lifetime equal to the runtime of the core the application is running on. This requires for a single entity to exist and manage all those bindings, applying the business logic and performing required high level operations.


## Entity CRUD Interface

The current implementation offers a normalized CRUD Interface with a selected set of operations. The purpose of having a normalized interface is to decouple the business logic from storage, models. ORM Adaptors implement the CRUD Interface giving you a vast array of options for the underlying persistent storage. As mentioned above, currently two ORM packages are supported, [Mongoose][] and [Sequelize][]. This pretty much covers all the popular databases like mongodb, Postgres, MySQL, Redis, SQLite and MariaDB.

### CRUD Primitive Operations

The CRUD Interface offers the following primitive operations:

  * `create()`
  * `read()`
  * `readOne()`
  * `readLimit()`
  * `update()`
  * `delete()`
  * `count()`

These primitives will transparently adapt to the most optimized operations on the ORM of your choosing and guarantee the outcome will always be the same no matter the underlying ORM.

All primitive methods offer Before/After hooks and return a Promise to determine resolution.

#### entity.create()

> entity.create(data)

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

#### entity.read()

> entity.read(query=)

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



## Authors

* [@thanpolas][thanpolas]

## Release History

- **v0.0.1**, *08 Oct 2013*
  - Big Bang

## License

Copyright 2013 Thanasis Polychronakis

Licensed under the [MIT License](LICENSE-MIT)

[thanpolas]: https://github.com/thanpolas "Thanasis Polychronakis"
[Mongoose]: http://mongoosejs.com/
[Sequelize]: http://sequelizejs.com/
[Inher]: https://github.com/thanpolas/inher/
