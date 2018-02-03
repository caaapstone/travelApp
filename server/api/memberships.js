const router = require('express').Router()
const {Membership} = require('../db/models')
const firebaseDb = require('../firebase')

module.exports = router

router.get('/', (req, res, next) => {
  Membership.findAll()
    .then(memberships => res.json(memberships))
    .catch(next)
})

router.post('/', function (req, res, next) {
  Membership.create(req.body)
  .then(membership => res.json(membership))
  .catch(next);
});

router.post('/flightinfo', (req, res, next) => {
  Membership.findOne({
    where: {
      tripId: req.body.tripId,
      userId: req.body.userId
    }
  })
  .then(result => {
    result.update({
      arrivalAirline: req.body.arrivalAirline,
      arrivalFlightNum: req.body.arrivalFlightNum,
      arrivalDate: req.body.arrivalDate,
      arrivalTime: req.body.arrivalTime,
      departureAirline: req.body.departureAirline,
      departureFlightNum: req.body.departureFlightNum,
      departureDate: req.body.departureDate,
      departureTime: req.body.departureTime,
      flightBooked: true
    })
    .then(updatedInfo => res.json(updatedInfo))
  })
})

router.post('/:tripId/user/:userId', (req, res, next) => {
  Membership.findOne({
    where: {
      tripId: req.params.tripId,
      userId: req.params.userId
    }
  })
  .then(result => {
    result.update({
      userCity: req.body.userCity,
      userState: req.body.userState,
      flightBudget: req.body.flightBudget,
      joined: true
    })
    .then(updatedInfo => res.json(updatedInfo))
  })
})

