const router = require('express').Router()
const {Trip} = require('../db/models')
const firebaseDb = require('../firebase')

module.exports = router

// REVIEW: authorization?

// GET /trips
//    req.user.getTrips()
router.get('/', (req, res, next) => {
  Trip.findAll()
    .then(trips => res.json(trips))
    .catch(next)
})

// req.user.trips.findById()
// GET /:tripID
//   if a row exists in memberships where tripId: params.tripId && userId = req.user.id
//   Membership.where({user_id: req.user.id, trip_id: req.params.tripId})
//
//   trip = req.user.trips.getById(req.params.tripId)
//   req.user.getTrips({
//     where: { tripId: req.params.tripId }
//   })
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
