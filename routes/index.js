module.exports = function(db) {
  var express = require('express');
  var router = express.Router();
  var mongoose = require('mongoose');
  var userSchema = require('../models/user');
  var logSchema = require('../models/log');
  var receiverSchema = require('../models/receiver');
  var bodyParser      = require('body-parser');
  var IOTA = require("iota.lib.js");

  var iota = new IOTA({
      'host': 'http://localhost',
      'port': 14700
  });

  router.get('/test', function(req, res) {
    console.log("yo");
    res.send(200);
  });

  router.post('/checkIn', function(req, res, next) {
    userSchema.findOne({"id_": req.body.id_}, "dmg", function(err, user) {
      if (err) {
        console.log(err);
        return res.end();
      } else if (!user) {
        console.log("user not found");
        return res.end();
      }
      var log = new logSchema({user_id: user.id_, dmg: user.dmg, location: req.body.beaconID, timestamp: new Date().toUTCString()});
      log.save(function(err, info) {
        if (err) console.log(err);
        else console.log("USER PINGED: " + req.body.id_ + " AT base station: " + req.body.beaconID);
        res.send({success: true, user_info: info.dmg});
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

  //inp array of beaconIDs, timeframe, number of pedestrians, array of demographics, totalcost
  router.post("/requestTraffic", function(req, res) {
    logSchema.find({
      location: req.body.beaconID,
      timestamp: {
        $gt: req.body.start,
        $lt: req.body.end
      }
    },{}, function(err, logs) {
      console.log(logs);
      var seed = process.env.seed;
      iota.api.getNewAddress(seed, {}, function(err, address) {
          if (err) {
            console.log(err);
            return err;
          }
          console.log(address);
          var receiver = new receiverSchema({address: address, timestamp: new Date()});
          receiver.save(function(err, info) {
            if (err) console.log(err);
            res.send({success: true, data: {address: address}});
          });
      });

      var topup = req.body.totalcost / req.body.num_pedestrians;

      for (var i = 0; i < logs.length; i++) {
        userSchema.findOneAndUpdate({id_: logs[i].user_id}, {$inc: {credit: topup}})
          .then(function(err, info) {
            if (err) console.log(err);
          });
      }
    });
  });

  router.post("/checkTransaction", function(req, res) {
    iota.api.getBalances(req.body.address, 100, function(err, info) {
      if (err) {
        console.log(err, info);
        res.send({success:false, err: err});
      } else {
        res.send({success: true, data: {balance: info.balances[0]}});
      }
    });
  });

  return router;
}
