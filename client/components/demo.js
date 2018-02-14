import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import { fetchUserTrips, deleteMembership, postTrip, auth, me } from '../store'
import history from '../history'
import BasicPieCart from './insights'


class Demo extends Component {
  componentDidMount() {
    const {user} = this.props
    if(user.email === undefined) {
      me()
    }
  }

  render(){
    return (
      <h1>Demo Page</h1>
    )
  }
}

const mapState = (state) => {
  return {
    user: state.user,
    userTrips: state.userTrips,
    topCityActivities: state.topCityActivities
  }
}

const mapDispatch = (dispatch) => {
  return {
    getUserTrips (userId) {
      dispatch(fetchUserTrips(userId))
    },
    removeMembership (ids) {
      dispatch(deleteMembership(ids))
    },
    createTrip: (userId, trip) => {
      return dispatch(postTrip(userId, trip))
      .then(trip =>{
        let tripId = trip.trip.id
        history.push(`/trips/tripdetails/${tripId}`)
      })
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(Demo))
