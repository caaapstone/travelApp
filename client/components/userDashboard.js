import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import { fetchUserTrips, deleteMembership, postTrip } from '../store'
import history from '../history'
import BasicPieCart from './insights'

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

  submitTrip = (event) =>{
    event.preventDefault()
    const userId = this.props.user.id
    this.props.createTrip(userId)
  }


  render(){
    const tripDate = new Date()
    let year = tripDate.getFullYear().toString()
    let month = (tripDate.getMonth() + 1).toString()
    let today = tripDate.getDate().toString()
    if (today.length < 2) {
      today = '0' + today
    }
    if (month.length < 2) {
      month = '0' + month
    }
    let todaysDate = year + '-' + month + '-' + today
    const { user, userTrips, topCityActivities } = this.props

    let invitations = userTrips.filter(trip => trip.joined === false && !trip.organizer)
    let currentDate = Date.now()
    let trips = userTrips.filter(trip => {
                      console.log("trip", trip)
                      return trip.flightBudget && (new Date(trip.trip.arrivalDate) > currentDate) && trip.trip.arrivalDate !== null && trip.trip.departureDate !== null
                    })
    let pastTrips = userTrips.filter(trip => trip.flightBudget && (new Date(trip.trip.arrivalDate) < currentDate))

    if (userTrips){
      return (
        <div className="two-rem-padding full-page-center">
          <div id="userpage-welcome">
            <div id="adventure">
              <h1 className="raleway">Start your next adventure.</h1>
              <p>Invite your friends, set your budgets and we'll let you know where you can go and help you plan what you can do!</p>
              <button className="button" onClick={this.submitTrip}>Create a Trip</button>
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
                    trip.trip.destinationCity ?
                    <p>{trip.trip.destinationCity}, {trip.trip.destinationState}</p>
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
            <h2 className="raleway light-blue">Need Some Inspiration?</h2>
            <p>Explore the top activities from our most travelled to cities.</p>
            <div id="stats-container">
              <div>
                <BasicPieCart />
              </div>
              <div className="top-activities">
                  {
                    topCityActivities.length
                      ? <div>
                        <p className="stats-label raleway">{`Top Activities in ${topCityActivities[0].location.city}`}</p>
                        {
                          topCityActivities.map(activity => (
                            <a href={activity.url} target="_blank" className="top-city-link">
                            <div className="top-city-result">
                              <div>
                                <img src={activity.image_url} className="top-city-image"/>
                              </div>
                              <div className="top-city-details">
                                <h3 className="no-margin raleway">{activity.name}</h3>
                                <p className="no-margin top-city-caption">{activity.categories[0].title}</p>
                              </div>
                            </div>
                            </a>
                          ))
                        }
                      </div>
                      : <div>
                        <p className="stats-label raleway">Top Activities</p>
                        <p>Select a top city from the graph on the left.</p>
                      </div>
                  }
              </div>
            </div>
          </div>
          <div>

          <h2 className="raleway light-blue">Upcoming Trips</h2>
          <div className="flex-start">
          {
            trips.length
            ? trips.map(trip => {
              return (
                <div key={trip.id} className="trip-info">
                  <Link to={`/flights/${trip.tripId}/${user.id}`}><div className="trip-info-header"><div className="center-vertically">{trip.trip.name}</div></div></Link>
                  {
                    trip.trip.destinationCity ?
                    <p className="no-margin">{trip.trip.destinationCity}, {trip.trip.destinationState}</p>
                    : ' TBD'
                  }
                  <p className="no-margin">{this.dateRange(trip.trip.arrivalDate)} - {this.dateRange(trip.trip.departureDate)}</p>
                  <p>Flight Budget: ${trip.flightBudget}</p>
                  <button className="button" onClick={() => history.push(`/flights/${trip.trip.id}/${trip.trip.userId}`)}>Trip Dashboard</button>
                </div>
              )
            })
          : <p>You have no upcoming trips scheduled.</p>
          }
          </div>
        </div>
        <br />
        <div>
          <h2 className="raleway light-blue">Past Trips</h2>
          <div className="flex-start">
          {
            pastTrips.length
            ? pastTrips.map(trip => {
              return (
                <div key={trip.id} className="trip-info">
                  <Link to={`/flights/${trip.tripId}/${user.id}`}><div className="trip-info-header"><div className="center-vertically">{trip.trip.name}</div></div></Link>
                  <p className="no-margin">
                  Destination:
                  {
                    trip.trip.destinationCity.length
                      ? <p>{trip.trip.destinationCity}, {trip.trip.destinationState}</p>
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

export default withRouter(connect(mapState, mapDispatch)(UserDashboard))
