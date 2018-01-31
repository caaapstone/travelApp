const router = require('express').Router()
// const {User} = require('../db/models')
const firebaseDb = require('../firebase')

module.exports = router

// POST because it is not specifying exact URL where stored
//this updates an already existing activity (re: activityID)
router.post('/', (req, res, next) => {
  // firebaseDb.ref('trips').push(req.body)
  // .then(res.sendStatus(200))
  console.log('req.body: ', req.body)
  let tripId = req.body.tripId
  let activityId = req.body.activityId
  let date = req.body.date
  let time = req.body.time
  let isActive = req.body.isActive
  let tripRef = firebaseDb.ref(`/trips/T${tripId}/${activityId}`)
  let updates = {
    date,
    time,
    isActive
  }
  console.log('date(api): ', date)
  console.log('time(api): ', time)
  console.log('activityId(api): ', activityId)
  console.log('tripId(api): ', tripId)
  tripRef.update(updates)
})

//new post request but creates a new activity from NOTHING
router.post('/new', (req, res, next) =>{
  let name = req.body.name
  let date = ''
  let time = ''
  let isActive = false
  let lat = req.body.lat
  let long = req.body.long
  let link = req.body.link
  let imageUrl = req.body.imageUrl
  let tripId = req.body.tripId

  let tripRef = firebaseDb.ref(`/trips/T${tripId}`)
  let newActivity = {
    name,
    date,
    time,
    isActive,
    lat,
    long,
    link,
    imageUrl,
    tripId
  }
  tripRef.push(newActivity)
})
