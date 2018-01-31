import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import user from './user'
import maps from './maps'
import users from './users'
import trip from './trip'
import membership from './membership'
import destinations from './destinations'
import userFlights from './flights'

const reducer = combineReducers({user, users, trip, membership, maps, destinations, userFlights})
const middleware = composeWithDevTools(applyMiddleware(
  thunkMiddleware,
  createLogger({collapsed: true})
))
const store = createStore(reducer, middleware)

export default store
export * from './user'
export * from './maps'
export * from './users'
export * from './trip'
export * from './membership'
export * from './destinations'
export * from './flights'
