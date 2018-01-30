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
  },
  organizer: {
    type: Sequelize.BOOLEAN
  },
  joined: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  upVotes: {
    type: Sequelize.INTEGER,
    defaultValue: 3
  },
  flightBooked: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
})

module.exports = Membership
