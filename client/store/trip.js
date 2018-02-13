import axios from 'axios'

const GET_TRIP = 'GET_TRIP'
const CREATE_TRIP = 'CREATE_TRIP'
const UPDATE_TRIP = 'UPDATE_TRIP'

const addTrip = trip => ({type: CREATE_TRIP, trip})
const getTrip = trip => ({type: GET_TRIP, trip})
const update = trip => ({type: UPDATE_TRIP, trip})

export const fetchTrip = (tripId) =>
  dispatch =>
    axios.get(`/api/trips/${tripId}`)
      .then(res =>
        dispatch(getTrip(res.data)))
      .catch(err => console.error(err))

export function postTrip(userId, newTrip) {
  return function thunk(dispatch) {
    return axios.post(`/api/trips`, {userId, newTrip})
      .then(res => res.data)
      .then(trip => {
        return dispatch(addTrip(trip))
      //   axios.post('/api/email/confirmation', emailaddresses)
      })
      .catch(err => console.error(err))
  }
}

export function updateTrip(tripId, updatedTrip) {
  return function thunk(dispatch) {
    return axios.put(`/api/trips/${tripId}`, updatedTrip)
      .then(res => res.data)
      .then(trip => {
        return dispatch(update(trip))
      })
      .catch(err => console.error(err))
  }
}

export const fetchTripInfo = (tripId) => dispatch => {
  axios.get(`/api/trips/${tripId}`)
    .then(res => {
      dispatch(getTrip(res.data))
    })
    .catch(err => console.error(err))
}

export default function (trips = {}, action) {
  switch (action.type) {
    // do we need this to be on state? (create trip)
    case CREATE_TRIP:
      return action.trip;
    case GET_TRIP:
      return action.trip;
    case UPDATE_TRIP:
      return Object.assign({}, trips, action.trip)
    default:
      return trips
  }
}
