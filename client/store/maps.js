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
