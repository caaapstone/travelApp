import React, {Component} from 'react'
import {connect} from 'react-redux'
import { postTrip } from '../store'
import history from '../history'
import TripDashboard from '../components'
import {Route, Switch, NavLink} from 'react-router-dom'
import { CalendarBoard } from './calendarBoard';
import {Router} from 'react-router'


 export class DashboardRoutes extends Component {

  render(){

    return (
      <Router>
      <TripDashboard>
        <Switch>
          <Route path="/trip/:tripId/calendar" render={() => <CalendarBoard /> }/>
          <Route path="/trip/:tripId/map" component={MapBoard} />
          <Route path="/trip/:tripId/ideas" component={IdeaBoard} />
        </Switch>
      </TripDashboard>
      </Router>
    )
  }
}

const mapState = (state) => {
  return {
  }
}

const mapDispatch = (dispatch) => {
  return {

  }
}

export default connect(mapState, mapDispatch)(DashboardRoutes)

