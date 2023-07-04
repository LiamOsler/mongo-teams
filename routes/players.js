var express = require('express');
var router = express.Router();

var Players = require('../models/Players');

router.get('/', async function(req, res, next) {
  //If the query is empty, return all players
  //Ex: http://localhost:3000/players
  if(req.query.action === undefined ) {
    console.log("hello");
    await Players.find({})
      .then((docs) => {
        res.send(docs);
      })
      .catch((err) => {
        console.error(err);
        res.send(err);
      });
    }

    else {
      //If the req action is findById, return the player with the id
      //Ex: http://localhost:3000/players?action=findById&id=64a2329dc348d68c6635112e
      if(req.query.action === "findById"){
        await Players.findById(req.query.id)
          .then((docs) => {
            if(docs == null) {
              res.json({message: "No player with requested id"});
            }
            else {
              res.send(docs);
            }
          })
          .catch((err) => {
            console.error(err);
            res.json({message: "Encountered an error"});
          });
      }
      //If the req action is findByIdAndDelete, delete the player with the id
      //Ex: http://localhost:3000/players?action=findByIdAndDelete&id=64a2329dc348d68c6635112e
      else if(req.query.action === "findByIdAndDelete"){
        await Players.findByIdAndDelete(req.query.id)
          .then((docs) => {
            if(docs == null) {
              res.json({message: "No player with requested id"});
            }
            else {
              res.send(docs);
            }
          })
          .catch((err) => {
            console.error(err);
            res.json({message: "Encountered an error"});
          });
       }
       //If the req action is findByIdAndUpdate, update the player with the id
       // Ex: http://localhost:3000/players?action=findByIdAndUpdate&id=64a2329dc348d68c6635112e&fname925=John&lname925=Doe&phone925=1234567890&preference925=1,2,3
       else if(req.query.action === "findByIdAndUpdate"){
        //Check if the required fields are missing
        if(
          req.query.fname925 === undefined ||
          req.query.lname925 === undefined ||
          req.query.phone925 === undefined ||
          req.query.preference925 === undefined
        ){
          res.json({message: "Missing required fields"});
        }else{
          //If all required fields are present, update the player
          await Players.findByIdAndUpdate(req.query.id,
            {
              fname925: req.query.fname925,
              lname925: req.query.lname925,
              phone925: req.query.phone925,
              preference925: req.query.preference925.split(",")
            })
          .then((docs) => {
            if(docs == null) {
              res.json({message: "No player with requested id"});
            }
            else {
              res.send(docs);
            }
          })
          .catch((err) => {
            console.error(err);
            res.json({message: "Encountered an error"});
          });
        }
      }
      //If the req action is create, create a new player
      //Ex: http://localhost:3000/players?action=create&fname925=John&lname925=Doe&phone925=1234567890&preference925=red,green,blue
      else if(req.query.action === "create"){
        //Check if the required fields are missing
        if(
          req.query.fname925 === undefined ||
          req.query.lname925 === undefined ||
          req.query.phone925 === undefined ||
          req.query.preference925 === undefined
        ){
          res.json({message: "Missing required fields"});
        }else{
          //If all required fields are present, create the player
          await Players.create(
            {
              fname925: req.query.fname925,
              lname925: req.query.lname925,
              phone925: req.query.phone925,
              preference925: req.query.preference925
            })
          .then((docs) => {
            if(docs == null) {
              res.json({message: "No player with requested id"});
            }
            else {
              res.send(docs);
            }
          })
          .catch((err) => {
            console.error(err);
            res.json({message: "Encountered an error"});
          });
        }
      }
      else{
        res.json({message: "Invalid action"});
      }
    } 
});

module.exports = router;
