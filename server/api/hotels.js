
const router = require('express').Router()
const {Lodging} = require('../db/models')
const firebaseDb = require('../firebase')
const request = require('request-promise')

module.exports = router

router.get('/possible', (req, res, next) => {
  var options = { method: 'GET',
    url: 'https://api.yelp.com/v3/businesses/search',
    qs: {
      term: req.query.term,
      latitude: req.query.long,
      longitude: req.query.lat,
      categories: 'hotels',
      radius: '20000',
      limit: '20'
    },
    headers:
      {
        authorization: 'Bearer 8z4I_13yqULHbTtL6mNePY_2n2r57MNfYDsdlQhdXBynqKxMn_E5ayFiSsh4VHF0YQaWWAi2wB1Xi01PBuc9jEX3nTHAg0Yl16kVXw0C6bxORko0RQV-cyB5xRNqWnYx'
      }
    }
  let possibleHotels = []

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    let results = JSON.parse(body).businesses

    results.forEach(result => {
      possibleHotels.push({
        name: result.name,
        add1: result.location.address1,
        add2: result.location.address2,
        city: result.location.city,
        state: result.location.state,
        lat: result.coordinates.latitude,
        long: result.coordinates.longitude,
        totalPrice: result.price,
        description: '',
        url: result.url,
        photoUrl: result.image_url,
        tripId: req.query.tripId,
        userId: req.query.userId
      })
    })

    // possibleHotels.forEach(hotel => {
    //   Lodging.create(hotel)
    // })
  })
  .then(() => res.send(possibleHotels))
})

router.get('/', (req, res, next) => {
  Lodging.findAll({
    where: {
      tripId: req.query.tripId
    }
  })
  .then(results => res.json(results))
})

router.get('/userhotel', (req, res, next) => {
  Lodging.findOne({
    where: {
      userId: req.query.userId,
      tripId: req.query.tripId
    }
  })
  .then(results => res.json(results))
})

router.post('/userhotel', (req, res, next) => {
  Lodging.findAll({
    where: {
      userId: req.body.userId,
      tripId: req.body.tripId
    }
  })
  .then(results => {
    results.forEach(result => result.destroy())
  })
  .then(() => {
    Lodging.create({
      name: req.body.name,
      add1: req.body.add1,
      city: req.body.city,
      state: req.body.state,
      lat: req.body.lat,
      long: req.body.long,
      url: req.body.url,
      photoUrl: req.body.photoUrl,
      userId: req.body.userId,
      tripId: req.body.tripId
    })
    .then(hotel => res.json(hotel))
  })
})
