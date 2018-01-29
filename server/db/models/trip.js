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
}, {
    getterMethods: {
    allDates () {
        let dates = []
        let currentDate = this.arrivalDate
        let addDays = function(days) {
          let date = new Date(this.valueOf())
          date.setDate(date.getDate() + days)
          return date
        }
        for (var i = 0; i <= this.duration; i++){
          dates.push(currentDate)
          currentDate = addDays.call(currentDate, 1)
        }
        return dates
    }
  }
})

Trip.hook('beforeValidate', (trip) => {
  trip.duration = Number(trip.departureDate.slice(-2)) - Number(trip.arrivalDate.slice(-2))
})

module.exports = Trip

