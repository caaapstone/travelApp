const router = require('express').Router()
const {Destination} = require('../db/models')
const firebaseDb = require('../firebase')
const request = require('request-promise')

module.exports = router

router.post('/', (req, res, next) => {
  Destination.destroy({
    where: {
      tripId: req.body.tripId
    }
  })
  .then(() => {
    req.body.possibleCities.forEach(city => {
      Destination.findOrCreate({
        where: {
          airport: city,
          possible: true,
          tripId: req.body.tripId
        }
      })
    })
  })
  .then(() => res.sendStatus(200))
})
