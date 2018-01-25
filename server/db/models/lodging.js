const Sequelize = require('sequelize')
const db = require('../db')

const Lodging = db.define('lodging', {
  name: {
    type: Sequelize.STRING
  },
  add1: {
    type: Sequelize.STRING
  },
  add2: {
    type: Sequelize.STRING
  },
  city: {
    type: Sequelize.STRING
  },
  state: {
    type: Sequelize.STRING
  },
  lat: {
    type: Sequelize.STRING
  },
  long: {
    type: Sequelize.STRING
  },
  totalPrice: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING
  },
  url: {
    type: Sequelize.STRING
  },
  photoUrl: {
    type: Sequelize.STRING
  }
})

module.exports = Lodging
