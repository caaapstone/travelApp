import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const CREATE_MEMBERSHIP = 'CREATE_MEMBERSHIP'
const UPDATE_MEMBERSHIP = 'UPDATE_MEMBERSHIP'

/**
 * ACTION CREATORS
 */

const addMembership = membership => ({type: CREATE_MEMBERSHIP, membership})
const update = membership => ({type: UPDATE_MEMBERSHIP, membership})

/**
 * THUNK CREATORS
 */

 export function postOrganizerMembership(newMembership) {
  return function thunk(dispatch) {
    return axios.post(`/api/users/email`, newMembership)
      .then(res =>
        dispatch(addMembership(res.data))
      )
      .catch(err => console.error(err))
  }
}

 export function updateMembership(membership) {
  return function thunk(dispatch) {
    return axios.post(`/api/memberships/${membership.tripId}/user/${membership.userId}`, membership)
      .then(res =>
        dispatch(update(res.data))
      )
      .catch(err => console.error(err))
  }
}


/**
 * REDUCER
 */
export default function (state = {}, action) {
  switch (action.type) {
    case CREATE_MEMBERSHIP:
      return {...state, membership: action.membership};
    case UPDATE_MEMBERSHIP:
      return {...state, membership: action.membership};
    default:
      return state
  }
}
