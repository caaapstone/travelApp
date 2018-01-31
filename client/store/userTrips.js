import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_USER_TRIPS = 'GET_USER_TRIPS'

/**
 * INITIAL STATE
 */
const defaultUserTrips = []

/**
 * ACTION CREATORS
 */
const getUserTrips = userAndTrips => ({type: GET_USER_TRIPS, userAndTrips})

/**
 * THUNK CREATORS
 */
export const fetchUserTrips = user =>
  dispatch =>
    axios.get(`/api/trips/user/${user.id}`)
      .then(res =>
        dispatch(getUserTrips(res.data)))
      .catch(err => console.log(err))

/**
 * REDUCER
 */
export default function (state = defaultUserTrips, action) {
  switch (action.type) {
    case GET_USER_TRIPS:
      return action.userAndTrips
    default:
      return state
  }
}
