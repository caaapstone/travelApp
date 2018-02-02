import React, {Component} from 'react'
import {connect} from 'react-redux'
import { NavLink } from 'react-router-dom'
import Flights from '../components/flights'
import CalendarBoard from '../components/calendarBoard'
import MapBoard from '../components/mapBoard'
import {fetchTrip} from '../store'

class TripDashboard extends Component {
  constructor(){
    super()
  }

  componentDidMount(){
    let tripId = this.props.match.params.tripId
    if (!this.props.trip.name){
      this.props.getTripInfo(tripId)
    }
  }

  render(){
   let tripId = this.props.match.params.tripId
    return (
      <div>
      <h1>{this.props.trip.name}</h1>
      <ul>
      <li><NavLink to={`/trip/${tripId}/ideas`}>Idea Board</NavLink></li>
      <li><NavLink to={`/trip/${tripId}/calendar`}>Schedule</NavLink></li>
      <li><NavLink to={`/trip/${tripId}/map`}>Map</NavLink></li>
      <li>Itinerary</li>
      </ul>
      </div>
    )
  }
}

let mapStateToProps = state => {
  return {
    trip: state.trip
  }
}

let mapDispatchToProps = dispatch => {
  return {
    getTripInfo(tripId){
      dispatch(fetchTrip(tripId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TripDashboard)
