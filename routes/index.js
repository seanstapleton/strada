module.exports = function(db) {
  var express = require('express');
  var router = express.Router();
  var mongoose = require('mongoose');
  var userSchema = require('../models/user');
  var logSchema = require('../models/log');

  router.post('/checkIn', function(req, res, next) {
    userSchema.findOne({id_: req.body.id_}, function(err, user) {
      var log = new logSchema({user_id: user.id_, dmg: user.dmg, location: req.body.beaconID});
      log.save(function(err, info) {
        if (err) console.log(err);
        else console.log("USER PINGED: " + req.body.id_ + " AT base station: " + info.beaconID);
        res.send({success: true});
      });
    });
  });

  router.post('/addUser', function(req, res, next) {
    var newUser = new userSchema(req.body);
    newUser.save(function(err, info) {
      if (err) console.log(err);
      else console.log("New USER added: " + req.body.id_);
    });
  });

  router.post("/requestTraffic", function(req, res) {
    logSchema.find({location: req.body.beaconID},{}, function(err, info) {
      console.log(info);
    });
  });

  return router;
}
