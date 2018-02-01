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
    let invitations = userTrips.filter(trip => !trip.flightBudget && !trip.hotelBudget)
    let trips = userTrips.filter(trip => trip.flightBudget && trip.hotelBudget)

    if (userTrips){
      return (
        <div>
          <h3>{user.firstName}'s Dashboard</h3>
          {
            !invitations.length ?
            <div />
            : <div>
              <h4>Trip invitations</h4>
              {
                invitations.map(trip => {
                  return (
                    <div key={trip.id}>
                      <Link to={`/trip/${trip.id}`}>{trip.trip.name}</Link><br />
                      Destination:
                      {
                        trip.destinationCity ?
                        <div>{trip.destinationCity}, {trip.destinationState}</div>
                        : 'Not yet selected'
                      }
                      <br />
                      Personal Flight Budget (total): {trip.flightBudget ? trip.flightBudget : 'Not yet submitted'}<br />
                      Personal Hotel Budget (daily): {trip.hotelBudget ? trip.hotelBudget : 'Not yet submitted'}<br />
                      Arrival Date: {trip.trip.arrivalDate}<br />
                      Departure Date: {trip.trip.departureDate}<br />
                    </div>)
                })
              }
            </div>
          }
          <br />
          <div>
          <h4>Your Trips</h4>
          {
            trips.map(trip => {
              return (
                <div key={trip.id}>
                  <Link to={`/trip/${trip.id}`}>{trip.trip.name}</Link><br />
                  Destination:
                  {
                    trip.destinationCity ?
                    <div>{trip.destinationCity}, {trip.destinationState}</div>
                    : 'Not yet selected'
                  }
                  <br />
                  Personal Flight Budget (total): {trip.flightBudget}<br />
                  Personal Hotel Budget (daily): {trip.hotelBudget}<br />
                  Arrival Date: {trip.trip.arrivalDate}<br />
                  Departure Date: {trip.trip.departureDate}<br />
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
