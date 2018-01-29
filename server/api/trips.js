const router = require('express').Router()
const {Trip} = require('../db/models')
const firebaseDb = require('../firebase')

module.exports = router

router.get('/', (req, res, next) => {
  Trip.findAll()
    .then(trips => res.json(trips))
    .catch(next)
})

router.get('/:tripId', (req, res, next) => {
  Trip.findById({id: req.param.tripId})
    .then(trip => res.json(trip))
    .catch(next)
})

router.post('/', function (req, res, next) {
  Trip.create(req.body)
  .then(trip => res.json(trip))
  .catch(next);
});
