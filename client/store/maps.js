import axios from 'axios'
import firebase from '../firebase'

//action types
export const INIT_ROUTES = 'INIT_ROUTES'
export const GET_DAILY_ROUTES = 'GET_DAILY_ROUTES'

//default state
export const defaultState = []

//action creators
export const getDailyRoutesActionCreator = routes => ({type: GET_DAILY_ROUTES, routes})

//reducer
export default function reducer (state = defaultState, action) {
  switch (action) {
    case GET_DAILY_ROUTES:
      return action.routes

    default:
      return state
  }
}

//thunks
export const getRoutes = coords => dispatch => {
  console.log('routes thunk', coords)
  // axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?radiuses=40;;100&geometries=polyline&access_token=pk.eyJ1IjoiYW1iaWwiLCJhIjoiY2pkMHNvaXp2MzhhdTJ4cngzMzk5dTJyMSJ9.BGoNBLsg0yW4Sswk3SaLjw`)
  // .then(res => dispatch(getDailyRoutesActionCreator(res.data)))
  // .catch(err => console.error(err))
}

// export const initMap = activities => dispatch => {
  // {long, lat} ==> format the info before dispatched
//"https://api.mapbox.com/directions/v5/mapbox/driving/13.4301,52.5109;13.4265,52.5080;13.4194,52.5072?radiuses=40;;100&geometries=polyline&access_token=your-access-token"
// }
