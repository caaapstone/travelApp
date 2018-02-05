const router = require('express').Router()
const {Trip, Membership, User} = require('../db/models')
const firebaseDb = require('../firebase')
const {isUser} = require('../middleware.js')
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
  let name = req.body.name || 'New Trip'
  let defaultBudget = req.body.defaultBudget || 200
  let destinationCity = req.body.destinationCity || null
  let destinationState = req.body.destinationState || null
  let arrivalDate = req.body.arrivalDate || null
  let departureDate = req.body.departureDate || null
  let newTrip = {
    name,
    defaultBudget,
    destinationCity,
    destinationState,
    arrivalDate,
    departureDate
  }
  Trip.create(newTrip)
  .then(trip => res.json(trip))
  .catch(next);
});

// update a trip
router.put('/:tripId', function (req, res, next) {
  let tripId = req.params.tripId
  let name = req.body.name
  let defaultBudget = req.body.defaultBudget || 200
  let arrivalDate = req.body.arrivalDate || null
  let departureDate = req.body.departureDate || null
  let newTrip = {
    name,
    defaultBudget,
    arrivalDate,
    departureDate
  }
  Trip.update(newTrip, {
    where: {
      id: tripId
    }
  })
  .then(trip => res.json(trip))
  .catch(next);
});

// GET all trips for one user
router.get('/user/:userId',  isUser, (req, res, next) => {
  Membership.findAll({
    where: {
      userId: req.params.userId
    },
    include: [
      { model: Trip }
    ]
  })
    .then(trips => res.json(trips))
    .catch(next)
})
