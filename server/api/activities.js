const router = require('express').Router()
// const {User} = require('../db/models')
const firebaseDb = require('../firebase')

module.exports = router

// POST because it is not specifying exact URL where stored
router.post('/', (req, res, next) => {
  // firebaseDb.ref('trips').push(req.body)
  // .then(res.sendStatus(200))
  console.log('req.body: ', req.body)
  let tripId = req.body.tripId
  let activityId = req.body.activityId
  let date = req.body.date
  let time = req.body.time
  let tripRef = firebaseDb.ref(`/trips/T${tripId}/${activityId}`)
  let updates = {
    date,
    time
  }
  console.log('date(api): ', date)
  console.log('time(api): ', time)
  console.log('activityId(api): ', activityId)
  console.log('tripId(api): ', tripId)
  tripRef.update(updates)
})

