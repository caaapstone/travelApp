import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_ACTIVITIES = 'GET_ACTIVITIES'

/**
 * INITIAL STATE
 */
const defaultActivities = []

/**
 * ACTION CREATORS
 */

const getActivities = activities => ({type: GET_ACTIVITIES, activities})

/**
 * THUNK CREATORS
 */

export const fetchActivities = (tripId) =>
  dispatch =>
    axios.get(`/api/activities/trip/${tripId}`)
      .then(res =>
        dispatch(getActivities(res.data)))
      .catch(err => console.log(err))


/**
 * REDUCER
 */
export default function (state = defaultActivities, action) {
  switch (action.type) {
    case GET_ACTIVITIES:
    return action.activities;
    default:
      return state
  }
}
