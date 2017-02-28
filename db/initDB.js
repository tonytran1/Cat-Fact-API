const promise = require('bluebird');

const options = {
  promiseLib: promise
};

const pgp = require('pg-promise')(options);

pgp.pg.defaults.ssl = true;

const connectionString = process.env.DATABASE_URL;
const db = pgp(connectionString);

db.query(pgp.QueryFile('../db/schema.sql', { minify: true }))
.then(response => {
  console.log("Database Initialization. ");
})
.catch(response => {
  console.log("Check the DB connection in db/initDB.js");
});

function getAllFacts(req, res, next) {
  db.any('SELECT Fact FROM Facts')
    .then(data => {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved All Facts'
        });
    })
    .catch(error => {
      return next(error);
    });
}

function getRandomFact(req, res, next) {
  db.one('SELECT count(*) From Facts').then(data => {
    db.any(`SELECT Fact FROM Facts OFFSET floor(random() * ${ data.count }) LIMIT 1`)
      .then(data => {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Retrieved Single Fact'
          });
      })
      .catch(error => {
        return next(error);
      });
  });
}

function getCatInfo(req, res, next) {
  let catName = req.params.name.replace(/cats|cat|\s+/g, '').toLowerCase();
  db.one(`SELECT Name, LifeSpan, Colors, Description FROM Cats WHERE Name LIKE '%${ catName }%'`)
    .then(data => {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved Cat Info'
        });
    })
    .catch(error => {
      res.status(200)
        .json({
          status: 'failure',
          message: 'No Cat Info'
        });
    });
}

function getAllCatInfo(req, res, next) {
  db.any('SELECT Name, LifeSpan, Description FROM Cats')
    .then(data => {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved Cat Info'
        });
    })
    .catch(error => {
      res.status(200)
        .json({
          status: 'failure',
          message: 'No Cat Info'
        });
    });
}


module.exports = {
  getAllFacts : getAllFacts,
  getRandomFact : getRandomFact,
  getCatInfo : getCatInfo,
  getAllCatInfo : getAllCatInfo
};
