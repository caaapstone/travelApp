const router = require('express').Router()
// const {User} = require('../db/models')
const firebaseDb = require('../firebase')

module.exports = router

router.get('/', (req, res, next) => {

})

router.put('/', (req, res, next) => {
  console.log(req.body)
  firebaseDb.ref('trips').push(req.body)
  .then(res.sendStatus(200))
})
