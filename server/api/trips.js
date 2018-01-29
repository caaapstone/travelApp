const router = require('express').Router()
const {Trip, User} = require('../db/models')

module.exports = router

// get all trips
router.get('/', (req, res, next) => {
  Trip.findAll()
    .then(trips => res.json(trips))
    .catch(next)
})

// get all trips for one user
router.get('/:userId', (req, res, next) => {
  User.findOne({
    where: {
      id: +req.params.userId
    },
    include: [
      { model: Trip }
    ]
  })
    .then(userAndTrips => res.json(userAndTrips))
    .catch(next)
})
