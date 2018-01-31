const router = require('express').Router()
module.exports = router
const firebaseDb = require('../firebase')
const seedData = require('./mockActivitiesData')

router.use('/users', require('./users'))
router.use('/activities', require('./activities'))
router.use('/trips', require('./trips'))
router.use('/memberships', require('./memberships'))
router.use('/flights', require('./flights'))
router.use('/destinations', require('./destination'))
router.use('/ideas', require('./ideas'))

router.post('/seed', (req, res, next) => {
  let activityArr = [seedData.trip1, seedData.trip2, seedData.trip3]
  for (let i = 0; i < activityArr.length; i++){
    for (let j = 0; j < activityArr[i].length; j++){
      firebaseDb.ref('trips').child('T' + (i + 1)).push(activityArr[i][j])
    }
  }
  // firebaseDb.ref('trips').child('T1').set(seedData.trip1)
  // firebaseDb.ref('trips').child('T2').set(seedData.trip2)
  // firebaseDb.ref('trips').child('T3').set(seedData.trip3)
  // .then(res.sendStatus(200))
  res.sendStatus(200)
})

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

