import axios from 'axios'

const GET_IDEAS = 'GET_IDEAS'

const getIdeas = ideas => ({type: GET_IDEAS, ideas})

export const fetchIdeas = (tripId, search) =>
  dispatch =>
    axios.get(`/api/ideas/trip/${tripId}`, {
      params: search
    })
      .then(res =>
        dispatch(getIdeas(res.data)))
      .catch(err => console.error(err))

export default function (state = {}, action) {
  switch (action.type) {
    case GET_IDEAS:
    return action.ideas;
    default:
      return state
  }
}
