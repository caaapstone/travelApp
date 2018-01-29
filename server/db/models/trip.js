const Sequelize = require('sequelize')
const db = require('../db')

const Trip = db.define('trip', {
  name: {
    type: Sequelize.STRING
  },
  defaultBudget: {
    type: Sequelize.INTEGER
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
  trip.duration = Number(trip.departureDate.slice(-2)) - Number(trip.arrivalDate.slice(-2))
})

module.exports = Trip
