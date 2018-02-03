import axios from 'axios'

/**
 * ACTION TYPES
 */
const CREATE_MEMBERSHIP = 'CREATE_MEMBERSHIP'
const GET_TRIP_MEMBERSHIP = 'GET_TRIP_MEMBERSHIP'


/**
 * ACTION CREATORS
 */

const addMembership = membership => ({type: CREATE_MEMBERSHIP, membership})
const getTripMembership = membership => ({type: GET_TRIP_MEMBERSHIP, membership})

/**
 * THUNK CREATORS
 */

 export function postOrganizerMembership(newMembership) {
  return function thunk(dispatch) {
    return axios.post(`/api/users/email`, newMembership)
      .then(res =>
        dispatch(addMembership(membership))
      )
      .catch(err => console.error(err))
  }
}


  export let getMembership = tripId => dispatch => {
    axios.get(`/api/memberships/${tripId}`)
      .then(res => {
        console.log('data from membership thunk', res.data)
        dispatch(getTripMembership(res.data))
      })
      .catch(err => console.error(err))
  }

/**
 * REDUCER
 */
export default function (state = {}, action) {
  switch (action.type) {
    case CREATE_MEMBERSHIP:
      return {...state, membership: action.membership};
    case GET_TRIP_MEMBERSHIP:
      return action.membership

    default:
      return state
  }
}
