const Sequelize = require('sequelize')
const db = require('../db')

const Destination = db.define('destination', {
  city: {
    type: Sequelize.STRING
  },
  state: {
    type: Sequelize.STRING
  },
  airport: {
    type: Sequelize.STRING
  },
  upVote: {
    type: Sequelize.INTEGER
  }
})

module.exports = Destination
