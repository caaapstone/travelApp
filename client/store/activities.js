import axios from 'axios'
import firebase from 'firebase'

const database = firebase.database()
const activeListeners = new Map


/**
 * ACTION TYPES
 */
const SET_TRIP_ACTIVITIES = 'SET_TRIP_ACTIVITIES'

/**
 * INITIAL STATE
 */
const defaultActivities = []

/**
 * ACTION CREATORS
 */

const setTripActivities = activities => ({type: SET_TRIP_ACTIVITIES, activities})

/**
 * THUNK CREATORS
 */


export const subscribeToTripThunkCreator = (component, tripId) =>
  dispatch => {
    console.log('we made it')
    const path = `/trips/T${tripId}`
    const ref = database.ref(path)
    const listener = snapshot => {
      let activityObj = snapshot.val()
      let newActivities = []
      for (let activity in activityObj){
        newActivities.push({
          ...activityObj[activity], activityId: activity
        })
      }
      dispatch(setTripActivities(newActivities))
    }
    activeListeners.set(component, { ref, listener })
    ref.on('value', listener)
  }

export const unsubscribeToTripThunkCreator = (component, tripId) =>
  dispatch => {
    const { ref, listener } = activeListeners.get(component)
    ref.off('value', listener)
    delete activeListeners[component]
    // dispatch something?
}

export const updateActivity = (activityObj) =>
  axios.post('/api/activities', activityObj)
    .then(() => { console.log('it worked?')})
    .catch(err => console.log(err))

export const createActivity = (activityObject) =>
  axios.post('/api/activities/new', activityObject)
    .then(() => {console.log('success')})
    .catch(err => console.error(err))

/**
 * REDUCER
 */
export default function (state = defaultActivities, action) {
  switch (action.type) {
    case SET_TRIP_ACTIVITIES:
    return action.activities;
    default:
      return state
  }
}
