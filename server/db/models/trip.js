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
    type: Sequelize.VIRTUAL,
    get() {
      let arrival = new Date(this.getDataValue('arrivalDate'))
      let departure = new Date(this.getDataValue('departureDate'))

      return (((departure - arrival)/86400000))
    }
  },
  lat: {
    type: Sequelize.STRING
  },
  long: {
    type: Sequelize.STRING
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

Trip.hook('beforeUpdate', (trip) => {
  console.log('trip info: ', trip)
  let arrival = new Date(trip.arrivalDate)
  let departure = new Date(trip.departureDate)

  trip.duration = (((departure - arrival)/86400000)+1)
})

module.exports = Trip

