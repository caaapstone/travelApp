const router = require('express').Router()
// const {User} = require('../db/models')
const firebaseDb = require('../firebase')

module.exports = router

// POST because it is not specifying exact URL where stored
//this updates an already existing activity (re: activityID)
router.post('/update', (req, res, next) => {
  console.log('req.body: ', req.body)
  let tripId = req.body.tripId
  let activityId = req.body.activityId
  let date = req.body.date
  let time = req.body.time
  let isActive = req.body.isActive
  let timeUpdated = req.body.timeUpdated
  let userUpdated = req.body.userUpdated
  let tripRef = firebaseDb.ref(`/trips/T${tripId}/${activityId}`)
  let updates = {
    date,
    time,
    isActive,
    timeUpdated,
    userUpdated
  }
  tripRef.update(updates)
})

router.post('/create', async (req, res, next) =>{
  let name = req.body.name
  let date = ''
  let time = ''
  let isActive = false
  let lat = req.body.lat
  let long = req.body.long
  let link = req.body.link
  let imageUrl = req.body.imageUrl
  let tripId = req.body.tripId
  let userId = req.body.userId
  let timeUpdated = req.body.timeUpdated
  let userUpdated = req.body.userUpdated
  let yelpInfo = req.body.yelpInfo

  let newActivity = {
    name,
    date,
    time,
    isActive,
    lat,
    long,
    link,
    imageUrl,
    tripId,
    timeUpdated,
    userUpdated,
    yelpInfo
  }

  try {
    const snapshot = await firebaseDb.ref(`/trips/T${tripId}`).once('value')
    const activities = snapshot.val()
    const activitiesArr = Object.entries(activities)
    const foundActivity = activitiesArr.find(([key, activity]) => {
      return activity.link === newActivity.link
    })

    if (foundActivity) {
      firebaseDb.ref(`/trips/T${tripId}/${foundActivity[0]}/users/U${userId}`).set(true)
      // res.send()
    } else {
      firebaseDb.ref(`/trips/T${tripId}`).push({
        ...newActivity,
        users: {
          ['U' + userId]: true,
        }
      })
      // res.send('')
    }
  }
  catch (error){
    next(error)
  }
})
