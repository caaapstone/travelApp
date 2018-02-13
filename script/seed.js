 /**
 * Welcome to the seed file! This seed file uses a newer language feature called...
 *
 *                  -=-= ASYNC...AWAIT -=-=
 *
 * Async-await is a joy to use! Read more about it in the MDN docs:
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
 *
 * Now that you've got the main idea, check it out in practice below!
 */
const db = require('../server/db')
const {User, Trip, Membership} = require('../server/db/models')

async function seed () {
  await db.sync({force: true})
  console.log('db synced!')
  // Whoa! Because we `await` the promise that db.sync returns, the next line will not be
  // executed until that promise resolves!

  const trips = await Trip.create({name: 'Capstone Reunion', arrivalDate: '2018-03-02', departureDate: '2018-03-05'})
  .then((result) => {
    Trip.create({name: 'Summer Break 2018', arrivalDate: '2018-07-01', departureDate: '2018-07-06'})
    }
  )
  .then(() => {
    Trip.create({name: 'College Reunion', arrivalDate: '2018-10-02', departureDate: '2018-10-05'})
  })

  let userIds

  const users = await Promise.all([
    User.create({email: 'cody@email.com', password: '123', firstName: 'Cody', lastName: 'Smith'}),
    User.create({email: 'murphy@email.com', password: '123', firstName: 'Sean', lastName: 'Murphy'}),
    User.create({email: 'pat@capstone.com', password: '123', firstName: 'Pat', lastName: 'Noonan'}),
    User.create({email: 'alyssad@capstone.com', password: '123', firstName: 'Alyssa', lastName: 'Drobatz'}),
    User.create({email: 'alyssavb@capstone.com', password: '123', firstName: 'Alyssa', lastName: 'Venere Braun'}),
    User.create({email: 'alexa@capstone.com', password: '123', firstName: 'Alexa', lastName: 'Billings'})
  ])
  .then(users => {
    userIds = users
  })

  const memberships = await Promise.all([
    Membership.create({userCity: 'CHI', userState: 'IL', flightBudget: 300, hotelBudget: 75, userId: userIds[2].id, tripId: 1, organizer: true, joined: true}),
    Membership.create({userCity: 'PHL', userState: 'PA', flightBudget: 300, hotelBudget: 75, userId: userIds[3].id, tripId: 1, organizer: false, joined: true}),
    Membership.create({userCity: 'NYC', userState: 'NY', flightBudget: 300, hotelBudget: 75, userId: userIds[4].id, tripId: 1, organizer: false, joined: true}),
    Membership.create({userCity: 'OMA', userState: 'NE', flightBudget: 300, hotelBudget: 75, userId: userIds[5].id, tripId: 1, organizer: false, joined: true}),
    Membership.create({userCity: 'CHI', userState: 'IL', flightBudget: 200, hotelBudget: 50, userId: userIds[0].id, tripId: 2, organizer: true, joined: true}),
    Membership.create({userCity: 'ATL', userState: 'GA', flightBudget: 250, hotelBudget: 75, userId: userIds[1].id, tripId: 2, organizer: false, joined: true})
  ])

  console.log(`seeded successfully`)
}

// Execute the `seed` function
// `Async` functions always return a promise, so we can use `catch` to handle any errors
// that might occur inside of `seed`
seed()
  .catch(err => {
    console.error(err.message)
    console.error(err.stack)
    process.exitCode = 1
  })
  .then(() => {
    console.log('closing db connection')
    db.close()
    console.log('db connection closed')
  })

console.log('seeding...')
