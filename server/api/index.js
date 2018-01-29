const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/trips', require('./trips'))
router.use('/memberships', require('./memberships'))
router.use('/flights', require('./flights'))
router.use('/destinations', require('./destination'))


router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
