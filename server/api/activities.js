const router = require('express').Router()
// const {User} = require('../db/models')
const firebaseDb = require('../firebase')

module.exports = router

// THIS WILL NEED TO BE UPDATED! (PER AD & AVB)
router.put('/', (req, res, next) => {
  console.log(req.body)
  firebaseDb.ref('trips').push(req.body)
  .then(res.sendStatus(200))
})
