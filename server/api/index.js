const router = require('express').Router()
module.exports = router
const firebaseDb = require('../firebase')
const seedData = require('./mockActivitiesData')

router.use('/users', require('./users'))
router.use('/trips', require('./trips'))
router.use('/memberships', require('./memberships'))
router.use('/flights', require('./flights'))
router.use('/destinations', require('./destination'))


router.post('/seed', (req, res, next) => {
  firebaseDb.ref('trips').push(seedData.trip1)
  firebaseDb.ref('trips').push(seedData.trip2)
  firebaseDb.ref('trips').push(seedData.trip3)
  .then(res.sendStatus(200))
})

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

