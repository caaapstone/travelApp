import axios from 'axios'

/**
 * ACTION TYPES
 */

const GET_DESTINATION_CITIES = 'GET_DESTINATION_CITIES'

/**
 * ACTION CREATORS
 */

const getDestinationCities = cities => ({type: GET_DESTINATION_CITIES, cities})

/**
 * THUNK CREATORS
 */

 export const fetchDestinationCities = (tripId) => dispatch => {
  axios.get('/api/destinations/possiblecities', {
    params: {tripId: tripId}
  })
    .then((response) => {
      let destinations = []
      response.data.forEach(destination => (
        destinations.push(destination)
      ))
      setTimeout(console.log('loading'), 1000)
    })
    .then(() => {
      axios.get('/api/destinations/possiblecities', {
        params: {tripId: tripId}
      })
      .then(results => {
        let updatedCities = results.data
        let sortedCities = updatedCities.sort(function(a, b) {
          return Number(b.upVote) - Number(a.upVote)
        })
        dispatch(getDestinationCities(sortedCities))
      })
    })
    .catch(err => console.error(err))
 }

 /**
 * REDUCER
 */

 export default function (destinationCities = [], action) {
   switch (action.type) {
    case GET_DESTINATION_CITIES:
      return action.cities
    default:
      return destinationCities
   }
 }
