const Sequelize = require('sequelize')
const db = require('../db')

const Trip = db.define('trip', {
  name: {
    type: Sequelize.STRING
  },
  destinationCity: {
    type: Sequelize.STRING
  },
  destinationState: {
    type: Sequelize.STRING
  },
  arrivalDate: {
    type: Sequelize.DATEONLY
  },
  departureDate: {
    type: Sequelize.DATEONLY
  },
  duration: {
    type: Sequelize.INTEGER
  }
})

Trip.hook('beforeValidate', (trip) => {
  let arrival = new Date(trip.arrivalDate)
  let departure = new Date(trip.departureDate)

  trip.duration = (((departure-arrival)/86400000)+1)
})

module.exports = Trip
