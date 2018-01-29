import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */

const GET_USERS = 'GET_USERS'

/**
 * ACTION CREATORS
 */

const getUsers = users => ({type: GET_USERS, users})


/**
 * THUNK CREATORS
 */

export const getAllUsers = () =>
  dispatch =>
  axios.get('/api/users')
    .then(res =>
      dispatch(getUsers(res.data)))
    .catch(err => console.error(err))


/**
 * REDUCER
 */
export default function (state = [], action) {
  switch (action.type) {
    case GET_USERS:
      return action.users
    default:
      return state
  }
}
