import React, {Component} from 'react'
import {connect} from 'react-redux'
import {CalendarBoard, MapBoard, IdeaBoard, Itinerary} from '../components'
import {fetchTrip} from '../store'
import {Route, Switch, NavLink} from 'react-router-dom'

class TripDashboard extends Component {

  componentDidMount(){
    let tripId = this.props.match.params.tripId
    if (!this.props.trip.name){
      this.props.getTripInfo(tripId)
    }
  }

  render(){
    const { trip } = this.props;
    return (
      <div>
      <h1>{this.props.trip.name}</h1>
      <div className="trip-dashboard-nav">
        <NavLink to={`/trip/${trip.id}/ideas`} className="nav-link">Idea Board</NavLink>
        <NavLink to={`/trip/${trip.id}/calendar`} className="nav-link">Schedule</NavLink>
        <NavLink to={`/trip/${trip.id}/map`} className="nav-link">Map</NavLink>
        <NavLink to={`/trip/${trip.id}/itinerary`} className="nav-link">Itinerary</NavLink>
      </div>
      <Switch>
        <Route path="/trip/:tripId/calendar" component={CalendarBoard} />
        <Route path="/trip/:tripId/map" component={MapBoard} />
        <Route path="/trip/:tripId/ideas" component={IdeaBoard} />
        <Route path="/trip/:tripId/itinerary" component={Itinerary} />
      </Switch>
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
