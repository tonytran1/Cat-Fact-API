const express = require('express');
const router = express.Router();
const db = require('../db/initDB');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cat Facts' });
});

router.get('/api/facts', db.getAllFacts);
router.get('/api/randomfact', db.getRandomFact);
router.get('/api/cats', db.getAllCatInfo);
router.get('/api/cats/:name', db.getCatInfo);

module.exports = router;
