import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */

const GET_USERS = 'GET_USERS'
const GET_USERS_ON_TRIP = 'GET_USERS_ON_TRIP'

/**
 * ACTION CREATORS
 */

const getUsers = users => ({type: GET_USERS, users})
const getUsersOnTrip = users => ({type: GET_USERS_ON_TRIP, users})


/**
 * THUNK CREATORS
 */

export const getAllUsers = () =>
  dispatch =>
  axios.get('/api/users')
    .then(res =>
      dispatch(getUsers(res.data)))
    .catch(err => console.error(err))

export const getUsersByEmail = email =>
  dispatch =>
    axios.post('/api/users/email', email)
      .then(res => {
        return dispatch(getUsers(res.data))})
      .catch(err => console.error(err))

export const fetchUsersOnTrip = (tripId) => dispatch => {
  axios.get('/api/flights/tripinfo', {
    params: {tripId: tripId}
  })
  .then(response => {
    let tripInfo = response.data
    let usersOnTrip = []
    tripInfo.memberships.forEach(member => {
      usersOnTrip.push({
        name: member.user.firstName + ' ' + member.user.lastName,
        origin: member.userCity,
        budget: member.flightBudget,
        ready: false,
        userId: member.userId,
        organizer: member.organizer,
        joined: member.joined,
        flightBooked: member.flightBooked,
        upVotes: member.upVotes,
        arrivalAirline: member.arrivalAirline,
        arrivalFlightNum: member.arrivalFlightNum,
        arrivalDate: member.arrivalDate,
        arrivalTime: member.arrivalTime,
        departureAirline: member.departureAirline,
        departureFlightNum: member.departureFlightNum,
        departureDate: member.departureDate,
        departureTime: member.departureTime,
        userEmail: member.user.email
      })
    })

    dispatch(getUsersOnTrip(usersOnTrip))
  })
  .catch(err => console.error(err))
}

/**
 * REDUCER
 */
export default function (state = [], action) {
  switch (action.type) {
    case GET_USERS:
      return action.users
    case GET_USERS_ON_TRIP:
      return action.users
    default:
      return state
  }
}
