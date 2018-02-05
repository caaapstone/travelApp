import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import { fetchUserTrips, deleteMembership } from '../store'
import history from '../history'

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

  dateRange(trip) {
   let splitDate = trip.split('-')
   let newDate = [splitDate[1], splitDate[2], splitDate[0]]
   return newDate.join('/')
  }

  render(){
    const { user, userTrips } = this.props
    let invitations = userTrips.filter(trip => trip.joined === false && !trip.organizer)
    let currentDate = Date.now()
    let trips = userTrips.filter(trip => trip.flightBudget && (new Date(trip.trip.arrivalDate) > currentDate))
    let pastTrips = userTrips.filter(trip => trip.flightBudget && (new Date(trip.trip.arrivalDate) < currentDate))
    if (userTrips){
      return (
        <div className="two-rem-padding">
          <div id="userpage-welcome">
            <div id="adventure">
              <h1 className="raleway">Start your next adventure.</h1>
              <p>Invite your friends, set your budgets and we'll let you know where you can go and help you plan what you can do!</p>
              <button className="button" onClick={() => history.push('/createtrip')}>Create a Trip</button>
            </div>
            <div className="center-vertically">
              <img src="/images/map.png" id="map-image" />
            </div>
          </div>
          {
            !invitations.length ?
            <div />
            : <div>
            <h2 className="raleway light-blue">Invitations</h2>
              {
                invitations.map(trip => {
                  return (
                    <div key={trip.id} className="trip-info">
                  <Link to={`/flights/${trip.tripId}/${user.id}`}><div className="trip-info-header"><div className="center-vertically">{trip.trip.name}</div></div></Link>
                  <p className="no-margin">
                  Destination:
                  {
                    trip.destinationCity ?
                    <p>{trip.destinationCity}, {trip.destinationState}</p>
                    : ' TBD'
                  }
                  </p>
                  <p className="no-margin">{this.dateRange(trip.trip.arrivalDate)} - {this.dateRange(trip.trip.departureDate)}</p>
                  <p>Flight Budget: ${trip.flightBudget}</p>
                      <button onClick={() => history.push(`/trips/jointrip/${trip.tripId}`)} className="button-outline">Join Trip</button>
                      <button onClick={() => this.declineInvitation(trip.tripId)} type="submit" className="button-outline">Decline invite</button>
                    </div>
                  )
                })
              }
            </div>
          }
          <br />
          <div>
          <h2 className="raleway light-blue">Upcoming Trips</h2>
          {
            trips.length
            ? trips.map(trip => {
              return (
                <div key={trip.id} className="trip-info">
                  <Link to={`/flights/${trip.tripId}/${user.id}`}><div className="trip-info-header"><div className="center-vertically">{trip.trip.name}</div></div></Link>
                  <p className="no-margin">
                  Destination:
                  {
                    trip.destinationCity ?
                    <p>{trip.destinationCity}, {trip.destinationState}</p>
                    : ' TBD'
                  }
                  </p>
                  <p className="no-margin">{this.dateRange(trip.trip.arrivalDate)} - {this.dateRange(trip.trip.departureDate)}</p>
                  <p>Flight Budget: ${trip.flightBudget}</p>
                  <button className="button" onClick={() => history.push(`/flights/${trip.trip.id}/${trip.trip.userId}`)}>Trip Dashboard</button>
                </div>
              )
            })
          : <p>You have no upcoming trips scheduled.</p>
          }
        </div>
        <br />
        <div>
          <h2 className="raleway light-blue">Past Trips</h2>
          {
            pastTrips.length
            ? pastTrips.map(trip => {
              return (
                <div key={trip.id} className="trip-info">
                  <Link to={`/flights/${trip.tripId}/${user.id}`}><div className="trip-info-header"><div className="center-vertically">{trip.trip.name}</div></div></Link>
                  <p className="no-margin">
                  Destination:
                  {
                    trip.destinationCity ?
                    <p>{trip.destinationCity}, {trip.destinationState}</p>
                    : ' TBD'
                  }
                  </p>
                  <p className="no-margin">{this.dateRange(trip.trip.arrivalDate)} - {this.dateRange(trip.trip.departureDate)}</p>
                  <p>Flight Budget: ${trip.flightBudget}</p>
                  <button className="button" onClick={() => history.push(`/trip/${trip.trip.id}/itinerary`)}>See Itinerary</button>
                </div>)
            })
          : <p>You haven't been on any trips yet.</p>
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
