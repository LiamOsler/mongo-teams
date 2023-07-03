var express = require('express');
var router = express.Router();

var Players = require('../models/Players');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  await Players.find({})
    .then((docs) => {
      res.send(docs);
    })
    .catch((err) => {
      console.error(err);
      res.send(err);
    });
});

module.exports = router;
