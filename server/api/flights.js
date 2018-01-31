const router = require('express').Router()
const {Flight, Trip, Membership, User} = require('../db/models')
const firebaseDb = require('../firebase')
const request = require('request-promise')

module.exports = router

router.get('/', (req, res, next) => {
  Flight.findAll({
    where: {
      tripId: req.query.tripId,
      userId: req.query.userId
    }
  })
  .then(flights => {
    res.json(flights)
  })
})

router.get('/trip', (req, res, next) => {
  let flightInfo

  let options = {
    method: 'GET',
    url: 'https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search',
    qs: {
      apikey: 'oVskbtEyd75zVOEaxQ0qR5ZvpOejXExA',
      origin: req.query.origin,
      departure_date: req.query.departure,
      'one-way': false,
      duration: req.query.duration,
      max_price: req.query.max_price
    }
  }

  Flight.destroy({
    where: {
      $and: [
        {userId: req.query.userId},
        {tripId: req.query.tripId}
      ]
    }
  })
  .then(() => {
    request(options, function (err, res, body) {
      if (err) throw new Error(err)
      flightInfo = JSON.parse(body)
    })
    .then(() => {
      flightInfo.results.forEach(destination => {
      Flight.create({
          airline: destination.airline,
          cost: Math.trunc(Number(destination.price)),
          userId: req.query.userId,
          tripId: req.query.tripId,
          city: destination.destination
        })
      })
    })
    .then(() => {res.sendStatus(200)})
  })
})

router.get('/tripinfo', (req, res, next) => {
  Trip.findOne({
    where: {
      id: req.query.tripId
    },
    include: [{
      model: Membership,
      include: [User]
    }]
  })
  .then((result) => res.json(result))
})

router.get('/activeusercities', (req, res, next) => {
  Flight.findAll({
    where: {
      tripId: req.query.tripId,
      userId: req.query.userId
    }
  })
  .then(results => res.json(results))
})

router.post('/setcity', (req, res, next) => {
  Trip.findOne({
    where: {
      id: req.body.tripId
    }
  })
  .then(trip => {
    trip.update({
      destinationCity: req.body.city,
      destinationState: req.body.state
    })
    .then(result => res.json(result))
  })
})
