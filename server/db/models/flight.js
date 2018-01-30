const Sequelize = require('sequelize')
const db = require('../db')

const Flight = db.define('flight', {
  airline: {
    type: Sequelize.STRING
  },
  city: {
    type: Sequelize.STRING
  },
  cost: {
    type: Sequelize.INTEGER
  }
})

module.exports = Flight
