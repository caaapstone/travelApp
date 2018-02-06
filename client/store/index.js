import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import user from './user'
import userTrips from './userTrips'
import maps from './maps'
import users from './users'
import trip from './trip'
import membership from './membership'
import destinations from './destinations'
import userFlights from './flights'
import activities from './activities'
import possibleHotels from './possibleHotels'
import userHotel from './userHotel'
import ideas from './ideas'
import topCityActivities from './statsCity'

const reducer = combineReducers({user, users, trip, membership, maps, destinations, userFlights, activities, ideas, userTrips, possibleHotels, userHotel, topCityActivities})
const middleware = composeWithDevTools(applyMiddleware(
  thunkMiddleware,
  createLogger({collapsed: true})
))
const store = createStore(reducer, middleware)

export default store
export * from './user'
export * from './userTrips'
export * from './maps'
export * from './users'
export * from './trip'
export * from './membership'
export * from './destinations'
export * from './flights'
export * from './activities'
export * from './possibleHotels'
export * from './userHotel'
export * from './ideas'
export * from './statsCity'
