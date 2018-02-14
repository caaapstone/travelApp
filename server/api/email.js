const router = require('express').Router()
module.exports = router
let nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'caaapstone@gmail.com',
    pass: 'caaapstone'
  }
})

router.post('/confirmation', (req, res, next) => {
  let recipient = req.body.email
  transporter.sendMail({
    from: 'caaapstone@gmail.comm',
    to: recipient,
    subject: 'Join our trip!',
    html: '<h3>You have been invited to join a trip with your friends!</h3><p>Click the below link to join your trip! If you do not have an account with us, you will have to create one to join the trip. LINK</p>'
  }, (error, info) => {
    if (error) {
      console.error(error)
      res.send(500)
    } else {
      res.send(200)
    }
  })
})
