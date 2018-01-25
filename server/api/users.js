const router = require('express').Router()
const {User} = require('../db/models')
const firebaseDb = require('../firebase')

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
  console.log(req.body)
  firebaseDb.ref('trips').push(req.body)
  .then(res.sendStatus(200))
})
