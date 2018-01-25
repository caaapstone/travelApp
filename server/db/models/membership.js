const Sequelize = require('sequelize')
const db = require('../db')

const Membership = db.define('membership', {
  userCity: {
    type: Sequelize.STRING
  },
  userState: {
    type: Sequelize.STRING
  },
  flightBudget: {
    type: Sequelize.INTEGER
  },
  hotelBudget: {
    type: Sequelize.INTEGER
  }
})

module.exports = Membership
