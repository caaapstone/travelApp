import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_IDEAS = 'GET_IDEAS'


/**
 * ACTION CREATORS
 */

const getIdeas = ideas => ({type: GET_IDEAS, ideas})

/**
 * THUNK CREATORS
 */



export const fetchIdeas = (tripId, search) =>
  dispatch =>
    axios.get(`/api/ideas/trip/${tripId}`, {
      params: search
    })
      .then(res =>
        dispatch(getIdeas(res.data)))
      .catch(err => console.log(err))


/**
 * REDUCER
 */
export default function (state = {}, action) {
  switch (action.type) {
    case GET_IDEAS:
    return action.ideas;
    default:
      return state
  }
}

// trip id from props
