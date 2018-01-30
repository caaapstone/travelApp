import axios from 'axios'

//action types
export const INIT_MAP = 'INIT_MAP'
export const GET_DAILY_ROUTES = 'GET_DAILY_ROUTES'

//default state
export const defaultState = []

//action creators
export const initMapActionCreator = map => ({type: INIT_MAP, map})
export const getDailyRoutes = routes => ({type: GET_DAILY_ROUTES, routes})

//reducer
export default function reducer (state = defaultState, action) {
  switch (action) {
    case INIT_MAP:
      return action.map

    case GET_DAILY_ROUTES:
      return action.routes

    default:
      return state
  }
}

//thunks
export const initMap = coordinates => dispatch => {
  axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?radiuses=40;;100&geometries=polyline&access_token=pk.eyJ1IjoiYW1iaWwiLCJhIjoiY2phOXN3Mng5MGE1OTJxcGV3d2E5bG80OCJ9.0FLVhhyTbMKWTeRtZGOSGA`)
  .then(res => dispatch(initMapActionCreator(res.data)))
  .catch(err => console.error(err))
}


// export const initMap = activities => dispatch => {
  // {long, lat} ==> format the info before dispatched
//"https://api.mapbox.com/directions/v5/mapbox/driving/13.4301,52.5109;13.4265,52.5080;13.4194,52.5072?radiuses=40;;100&geometries=polyline&access_token=your-access-token"
// }
