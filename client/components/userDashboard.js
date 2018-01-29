import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import { fetchUserTrips } from '../store'

class UserDashboard extends Component {

  componentDidMount(){
    this.props.getUserTrips()
  }

  render(){
    const { user, userTrips } = this.props
    console.log('user: ', user)
    console.log('userTrips: ', userTrips)
    if (userTrips){
      return (
        <div>
        {console.log('userTrips: ', userTrips)}
          <h3>{user.name}'s Dashboard</h3>
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
    userTrips: state.userTrips.trips
  }
}

const mapDispatch = (dispatch, ownProps) => {
  return {
    getUserTrips () {
      console.log('userId: ', ownProps.match.params.userId)
      dispatch(fetchUserTrips(ownProps.match.params.userId))
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(UserDashboard))
