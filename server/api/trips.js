const router = require('express').Router()
const {Trip, Membership, User} = require('../db/models')
const firebaseDb = require('../firebase')

module.exports = router

// GET all trips
router.get('/', (req, res, next) => {
  Trip.findAll()
    .then(trips => res.json(trips))
    .catch(next)
})

// GET single trip
router.get('/:tripId', (req, res, next) => {
  Trip.findById(req.params.tripId)
    .then(trip => res.json(trip))
    .catch(next)
})

// POST new trip
router.post('/', function (req, res, next) {
  Trip.create(req.body)
  .then(trip => res.json(trip))
  .catch(next);
});

// GET all trips for one user
router.get('/user/:userId', (req, res, next) => {
  Membership.findAll({
    where: {
      userId: 1
    },
    include: [
      { model: Trip }
    ]
  })
    .then(trips => res.json(trips))
    .catch(next)
})
