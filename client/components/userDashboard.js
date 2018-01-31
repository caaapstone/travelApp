import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import { fetchUserTrips } from '../store'

class UserDashboard extends Component {

  componentDidMount(){
    let userId = this.props.match.params.userId
    this.props.getUserTrips(userId)
  }

  render(){
    const { user, userTrips } = this.props
    if (userTrips){
      return (
        <div>
          <h3>{user.firstName}'s Dashboard</h3>
          <div>
            Past trips:
            {
              userTrips.filter(trip => !trip.isActive).map(singleTrip => {
                return (
                  <div key={singleTrip.id}>
                    <Link to={`/trip/${singleTrip.id}`}>{singleTrip.name}</Link>
                    {singleTrip.name}
                    {singleTrip.destinationCity}, {singleTrip.destinationState}
                    {singleTrip.budget}
                    {singleTrip.arrivalDate} - {singleTrip.departureDate}
                  </div>)
              })
            }
          </div>
          <div>
            Upcoming trips:
            {
              userTrips.filter(trip => trip.isActive).map(singleTrip => {
                return (
                  <div key={singleTrip.id}>
                    <Link to={`/trip/${singleTrip.id}`}>{singleTrip.name}</Link>
                    {singleTrip.destinationCity}, {singleTrip.destinationState}
                    {singleTrip.budget}
                    {singleTrip.arrivalDate} - {singleTrip.departureDate}
                  </div>)
              })
            }
          </div>
        </div>
      )
    } else {
      return <div />
    }
  }
}

const mapState = (state) => {
  return {
    user: state.user,
    userTrips: state.userTrips
  }
}

const mapDispatch = (dispatch) => {
  return {
    getUserTrips (userId) {
      dispatch(fetchUserTrips(userId))
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(UserDashboard))
