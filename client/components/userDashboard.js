import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import { fetchUserTrips, deleteMembership } from '../store'

class UserDashboard extends Component {

  componentDidMount(){
    this.props.getUserTrips(this.props.user.id)
  }

  declineInvitation = (tripId) => {
    let userId = this.props.user.id
    let ids = {
      userId,
      tripId
    }
    this.props.removeMembership(ids)
  }
  render(){
    const { user, userTrips } = this.props
    let invitations = userTrips.filter(trip => !trip.flightBudget)
    let trips = userTrips.filter(trip => trip.flightBudget)
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
                      Destination:
                      {
                        trip.destinationCity ?
                        <div>{trip.destinationCity}, {trip.destinationState}</div>
                        : 'Not yet selected'
                      }
                      <br />
                      Personal Flight Budget (total): {trip.flightBudget ? trip.flightBudget : 'Not yet submitted'}<br />
                      Arrival Date: {trip.trip.arrivalDate}<br />
                      Departure Date: {trip.trip.departureDate}<br />
                      <Link to={`/trips/jointrip/${trip.tripId}`}><input type="button" value="join this trip"/></Link>
                      <button onClick={() => this.declineInvitation(trip.tripId)} type="submit">Decline invite</button>
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
                  <Link to={`/trip/${trip.tripId}`}>{trip.trip.name}</Link><br />
                  Destination:
                  {
                    trip.destinationCity ?
                    <div>{trip.destinationCity}, {trip.destinationState}</div>
                    : 'Not yet selected'
                  }
                  <br />
                  Personal Flight Budget (total): {trip.flightBudget}<br />
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
    },
    removeMembership (ids) {
      dispatch(deleteMembership(ids))
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(UserDashboard))
