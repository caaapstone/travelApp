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
//create trip in firebase
//add current user
// POST new trip
router.post('/', function (req, res, next) {
  let name = req.body.name || 'New Trip'
  let defaultBudget = req.body.defaultBudget || 200
  let destinationCity = req.body.destinationCity || null
  let destinationState = req.body.destinationState || null
  let arrivalDate = req.body.arrivalDate || null
  let departureDate = req.body.departureDate || null
  let userId = req.body.userId
  // console.log("api user id", userId)
  let newTrip = {
    name,
    defaultBudget,
    destinationCity,
    destinationState,
    arrivalDate,
    departureDate
  }


  let newActivity = {
    name: "I'm an activity",
    date: '',
    time: '',
    isActive: '',
    lat: '',
    long: '',
    link: '',
    imageUrl: '',
    tripId: '',
    timeUpdated: '',
    userUpdated: '',
    yelpInfo: ''
  }

  Trip.create(newTrip)
  .then(trip => {
    res.json(trip)
    firebaseDb.ref(`/trips/T${trip.id}`).push({
        ...newActivity,
        users: {
          ['U' + userId]: true,
        }
    })
  })
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
