import axios from 'axios'

const SET_POSSIBLE_HOTELS = 'SET_POSSIBLE_HOTELS'
const GET_POSSIBLE_HOTELS = 'GET_POSSIBLE_HOTELS'

const setPossibleHotels = hotels => ({type: SET_POSSIBLE_HOTELS, hotels})
const getPossibleHotels = hotels => ({type: GET_POSSIBLE_HOTELS, hotels})

 export const hotelSearch = (lat, long, tripId) => dispatch => {
   axios.get('/api/hotels/possible', {
     params: {
       lat: lat,
       long: long,
       tripId: tripId
     }
   })
   .then(() => {
     setTimeout(console.log('loading'), 1000)
   })
   .then(() => {
     axios.get('/api/hotels', {
       params: {
         tripId: tripId
       }
     })
     .then(results => dispatch(setPossibleHotels(results.data)))
   })
 }

 export const getHotels = (tripId) => dispatch => {
   axios.get('/api/hotels', {
     params: {
       tripId: tripId
     }
   })
   .then(results => {
     dispatch(getPossibleHotels(results.data))
   })
 }

export default function (hotels = [], action) {
  switch (action.type) {
    case SET_POSSIBLE_HOTELS:
      return action.hotels
    case GET_POSSIBLE_HOTELS:
      return action.hotels
    default:
      return hotels
  }
}
