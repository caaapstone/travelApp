const router = require('express').Router()
const {Membership} = require('../db/models')
const firebaseDb = require('../firebase')

module.exports = router

router.get('/', (req, res, next) => {
  Membership.findAll()
    .then(memberships => res.json(memberships))
    .catch(next)
})

router.post('/', function (req, res, next) {
  Membership.create(req.body)
  .then(membership => res.json(membership))
  .catch(next);
});
