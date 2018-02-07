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
      apikey: 'lCBkNzEA1atSXjsWbDvWaIW2lvjPdwAz',
      origin: req.query.origin,
      departure_date: req.query.departure,
      'one-way': false,
      duration: req.query.duration,
      max_price: req.query.max_price
    }
  }

  console.log('OPTIONS: ', options)

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
  var options = { method: 'GET',
    url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${req.body.city}%20${req.body.state}.json`,
    qs: { access_token: 'pk.eyJ1IjoiYW1iaWwiLCJhIjoiY2pkMHNvaXp2MzhhdTJ4cngzMzk5dTJyMSJ9.BGoNBLsg0yW4Sswk3SaLjw' }
  }
  let coordinates

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    coordinates = JSON.parse(body).features[0].geometry.coordinates
  })
  .then(() => {
    Trip.findOne({
      where: {
        id: req.body.tripId
      }
    })
    .then(trip => {
      trip.update({
        destinationCity: req.body.city,
        destinationState: req.body.state,
        lat: coordinates[0],
        long: coordinates[1]
      })
      .then(result => res.json(result))
    })
  })
})
