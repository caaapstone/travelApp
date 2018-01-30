const User = require('./user')
const Membership = require('./membership')
const Trip = require('./trip')
const Flight = require('./flight')
const Lodging = require('./lodging')
const Destination = require('./destination')


User.hasMany(Lodging)
Lodging.belongsTo(User)

User.hasMany(Flight)
Flight.belongsTo(User)

Membership.belongsTo(User)

User.belongsToMany(Trip, {through: 'membership'})
Trip.belongsToMany(User, {through: 'membership'})

Membership.belongsTo(Trip)

Flight.belongsTo(Trip)
Trip.hasMany(Flight)

Lodging.belongsTo(Trip)
Trip.hasMany(Lodging)

Destination.belongsTo(Trip)
Trip.hasMany(Destination)

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */
module.exports = {
  User,
  Membership,
  Trip,
  Flight,
  Lodging,
  Destination
}
