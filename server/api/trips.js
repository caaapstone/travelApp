const router = require('express').Router()
const {Trip, Membership} = require('../db/models')
const firebaseDb = require('../firebase')

module.exports = router

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


router.get('/user/:userId', (req, res, next) => {
  // Membership.where({user_id: req.user.id, trip_id: req.params.tripId})
  req.params.userId.getTrips()
   .then(trip => res.json(trip))
   .catch(next)
})
