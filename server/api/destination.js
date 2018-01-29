const router = require('express').Router()
const {Destination} = require('../db/models')
const firebaseDb = require('../firebase')
const request = require('request-promise')

module.exports = router

router.post('/', (req, res, next) => {
  let possibleCities = []

  Destination.destroy({
    where: {
      tripId: req.body.tripId
    }
  })
  .then(() => {
    let responseArr = []
    for (var i = 0; i < req.body.possibleCities.length; i++) {
      let airportCode = req.body.possibleCities[i]
      var options = { method: 'POST',
        url: 'https://www.air-port-codes.com/api/v1/single',
        qs: { iata: req.body.possibleCities[i] },
        headers:
        { 'postman-token': '60803087-7ea8-675e-b368-a73ee9928e93',
          'cache-control': 'no-cache',
          'apc-auth-secret': '5b88c871f6917fa',
          'apc-auth': 'b4b4a61b8b' }
      }
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        let result = JSON.parse(body)
        responseArr.push({
          airport: airportCode,
            city: result.airport.city,
            state: result.airport.state.abbr,
            tripId: req.body.tripId,
            possible: true
        })

        Destination.findOrCreate({
          where: {
            airport: airportCode,
            city: result.airport.city,
            state: result.airport.state.abbr,
            tripId: req.body.tripId,
            possible: true
          }
        })
      })
    }
  })
  .then(() => res.sendStatus(200))
})

router.get('/possiblecities', (req, res, next) => {
  console.log(req.query.tripId)
  Destination.findAll({
    where: {
      tripId: req.query.tripId
    }
  })
  .then(result => res.json(result))
})
