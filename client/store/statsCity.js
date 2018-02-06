import axios from 'axios'

const GET_TOP_CITY_ACTIVITIES = 'GET_TOP_CITY_ACTIVITIES'

const getTopCityActivities = activities => ({type: GET_TOP_CITY_ACTIVITIES, activities})

export const fetchTopCityActivities = (city) => dispatch => {

  axios.get('/api/ideas/topactivities', {
    params: {
      city: city
    }
  })
  .then(results => {
    dispatch(getTopCityActivities(results.data))
  })
}

export default function (topCityActivities = [], action) {
  switch (action.type) {
    case GET_TOP_CITY_ACTIVITIES:
      return action.activities
    default:
      return topCityActivities
  }
}
