import axios from 'axios';
import firebase from '../firebase'

//action types
export const SET_COORDINATES = 'SET_COORDINATES'
export const GET_DAILY_ROUTES = 'GET_DAILY_ROUTES'
export const SET_MAP = 'SET_MAP'

//default state
export const defaultState = []

//action creators
export const setCoordinatesActionCreator = coordinates => ({type: SET_COORDINATES, coordinates})
export const getDailyRoutesActionCreator = routes => ({type: GET_DAILY_ROUTES, routes})
export const setMapActionCreator = map => ({type: SET_MAP, map})

//reducer
export default function reducer (state = defaultState, action) {
  switch (action) {
    case SET_COORDINATES:
      return action.coordinates

    case GET_DAILY_ROUTES:
      return [...action, action.routes]

    case SET_MAP:
      return action.map

    default:
      return state
  }
}
//map coordinates
//thunks
// export const getRoutes = (coords) => dispatch => {
//   axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?radiuses=unlimited;;100&geometries=polyline&access_token=pk.eyJ1IjoiYW1iaWwiLCJhIjoiY2pkMHNvaXp2MzhhdTJ4cngzMzk5dTJyMSJ9.BGoNBLsg0yW4Sswk3SaLjw`)
//   .then(res => {
//     console.log('routes data', res.data)
//     // dispatch(getDailyRoutesActionCreator(res.data))
//   })
//   .catch(err => console.error(err))
// }
