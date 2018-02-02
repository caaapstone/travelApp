import React, {Component} from 'react'
import {connect} from 'react-redux'
import Flights from '../components/flights'
import {CalendarBoard, MapBoard, IdeaBoard} from '../components'
import {fetchTrip} from '../store'
import {Route, Switch, NavLink} from 'react-router-dom'
import { DashboardRoutes } from './dashboardRoutes';

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
   let {children} = this.props
   console.log('children: ', children)
    return (
      <div>
      <h1>{this.props.trip.name}</h1>
      <ul>
        <li><NavLink to={`/trip/${tripId}/ideas`}>Idea Board</NavLink></li>
        <li><NavLink to={`/trip/${tripId}/calendar`}>Schedule</NavLink></li>
        <li><NavLink to={`/trip/${tripId}/map`}>Map</NavLink></li>
        <li>Itinerary</li>
      </ul>
      <Switch>
        <Route path="/trip/:tripId/calendar" render={() => <CalendarBoard /> }/>
        <Route path="/trip/:tripId/map" component={MapBoard} />
        <Route path="/trip/:tripId/ideas" component={IdeaBoard} />
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
