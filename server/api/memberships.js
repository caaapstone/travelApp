const router = require('express').Router()
const {Membership} = require('../db/models')
const firebaseDb = require('../firebase')

module.exports = router

router.get('/', (req, res, next) => {
  Membership.findAll()
    .then(memberships => res.json(memberships))
    .catch(next)
})

// router.post('/', function (req, res, next) {
//   let userId = req.body.userId
//   let tripId = req.body.tripId
//   let joined = req.body.joined,
//   let organizer = req.body.organizer
//   Membership.create({
//     where: {
//       email: email
//     }
//   })
//   .then(user => {
//     return Trip.find({
//       where: {
//         id: tripId
//       }
//     })
//     .then((trip)=>{
//       trip.addUser(user[0])
//     })
//   })
//   .catch(next)
// });
