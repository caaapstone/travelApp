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
  // REVIEW: danger danger
  // is there a unique constraint here? user_id/trip_id
  Membership.create(req.body)
  .then(membership => res.json(membership))
  .catch(next);
});
