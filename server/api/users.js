const router = require('express').Router()
const {User, Trip} = require('../db/models')
const firebaseDb = require('../firebase')
// const mockActivitiesData = require('./mockActivitiesData')

module.exports = router

router.get('/', (req, res, next) => {
  User.findAll({
    // explicitly select only the id and email fields - even though
    // users' passwords are encrypted, it won't help if we just
    // send everything to anyone who asks!
    attributes: ['id', 'email']
  })
    .then(users => res.json(users))
    .catch(next)
})

router.post('/test', (req, res, next) => {
  firebaseDb.ref('trips').push(req.body)
  .then(res.sendStatus(200))
})

router.post('/email', (req, res, next)=>{
  let email = req.body.email
  let tripId = req.body.id
  let joined = req.body.joined
  let organizer = req.body.organizer
  User.findOrCreate({
    where: {
      email: email
    }
  })
  .then(user => {
    return Trip.find({
      where: {
        id: tripId
      }
    })
    .then((trip)=>{
      trip.addUser(user[0], { through: { joined: joined, organizer: organizer }})
    })
  })
  .catch(next)
})
