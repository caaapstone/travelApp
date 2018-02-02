import axios from 'axios'

/**
 * ACTION TYPES
 */

const SET_USER_HOTEL = 'SET_USER_HOTE'
const GET_USER_HOTEL = 'GET_USER_HOTEL'

 /**
 * ACTION CREATORS
 */

export const setUserHotel = hotel => ({type: SET_USER_HOTEL, hotel})
const getUserHotel = hotel => ({type: GET_USER_HOTEL, hotel})

/**
 * THUNK CREATORS
 */

export const fetchUserHotel = (userId, tripId) => dispatch => {
  axios.get('/api/hotels/userhotel', {
    params: {
      userId: userId,
      tripId: tripId
    }
  })
  .then(results => {
    if (results.data){
      dispatch(getUserHotel(results.data))
    } else {
      dispatch(getUserHotel({}))
    }
  })
}

/**
 * REDUCER
 */

export default function(userHotel = {}, action) {
  switch (action.type) {
    case GET_USER_HOTEL:
      return action.hotel
    case SET_USER_HOTEL:
      return action.hotel
    default:
      return userHotel
  }
}
