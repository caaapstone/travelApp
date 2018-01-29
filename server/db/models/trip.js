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
  }
})

module.exports = Trip
