var Mongoose = require('mongoose'), cfg = require('../config');
Mongoose.Promise = require('bluebird');
var Connection = Mongoose.connection;
var model = require('./models');
var mongo = require('mongodb');


var db = Mongoose.connect(
  cfg.mongo.uri, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(
    () => {
        console.log("connection with database succeeded");
    }
  )
  .catch(
    err => console.log(err)
  );

Mongoose.set('debug', true);

exports.checkIfExists = function (query, collectionName) {

  return new Promise(function (resolve, reject) {
    var coll = model.getModel(collectionName);
    coll.findOne(query, function (err, results) {
      if (err)
        reject(err)
      else
        resolve(results)
    })
  })
}

exports.insert = function (doc, collectionName) {

  return new Promise(function (resolve, reject) {
    Connection.collection(collectionName).insertOne(doc).then(
      function (obj) {
        resolve(obj);
      }
    ).catch(function (err) {
      reject(err);
    });
  })
}


exports.getCollectionCountWithCriteria = function (collectionName, criteria) {

  return new Promise(function (resolve, reject) {
    var coll = model.getModel(collectionName);
    coll.find(criteria).count(function (err, count) {
      if (err)
        reject(err)
      else
        resolve(count)
    })
  })
}

exports.getCollectionWithCriteriaAndProjections = function (collectionName, criteria, projections, options) {

  return new Promise(function (resolve, reject) {
    var coll = model.getModel(collectionName);
    coll.find(criteria, projections, options, function (err, results) {

      if (err)
        reject(err)
      else
        resolve(results)

    })
  })
}

exports.findOneWithCriteriaAndProjections = function (collectionName, criteria, projections) {

  return new Promise(function (resolve, reject) {

    var coll = model.getModel(collectionName);
    coll.findOne(criteria, projections, function (err, results) {

      if (err)
        reject(err)
      else
        resolve(results)


    })



  })

}

exports.updateCollection = function (collectionName, criteria, updateDoc, multi, upsert = true, arrayFilters = {}) {

  return new Promise(function (resolve, reject) {

    var coll = model.getModel(collectionName);

    coll.update(criteria, updateDoc, { 'multi': multi, 'strict': false, 'upsert': upsert }, function (err, results) {
     
      if (err)
        reject(err)
      else
        resolve(results)
    })
  })
}
