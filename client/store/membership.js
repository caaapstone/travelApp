import axios from 'axios'

/**
 * ACTION TYPES
 */
const CREATE_MEMBERSHIP = 'CREATE_MEMBERSHIP'


/**
 * ACTION CREATORS
 */

const addMembership = membership => ({type: CREATE_MEMBERSHIP, membership})

/**
 * THUNK CREATORS
 */

 export function postMembership(newMembership) {
  return function thunk(dispatch) {
    return axios.post(`/api/memberships`, newMembership)
      .then(res => res.data)
      .then(membership => {
        dispatch(addMembership(membership))
      })
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
    default:
      return state
  }
}
