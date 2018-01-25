const admin = require('firebase-admin')
const serviceRequest = require('../../firebase-key.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceRequest),
  databaseURL: 'https://caaapstone.firebaseio.com'
})

const firebaseDb = admin.database()

module.exports = firebaseDb
