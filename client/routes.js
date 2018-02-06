import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Route, Switch, Router} from 'react-router-dom'
import PropTypes from 'prop-types'
import history from './history'
import {me} from './store'
import {Main, Login, Signup, UserHome, Flights, CreateTrip, JoinTrip, MapBoard, CalendarBoard, IdeaBoard, TripDetailsSetUp, UserDashboard, TripDashboard, Hotels, Stats, Insights} from './components'

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount () {
    this.props.loadInitialData()
  }

  render () {
    const {isLoggedIn} = this.props

    return (
      <Router history={history}>
        <Main>
          <Switch>
            {/* Routes placed here are available to all visitors */}
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/testdata" component={Insights} />
            {
              isLoggedIn &&
              <Switch>
              {/* Routes placed here are only available after logging in */}
                <Route exact path="/createtrip" component={CreateTrip} />
                <Route exact path={'/trips/tripdetails/:tripId'} component={TripDetailsSetUp} />
                <Route exact path={'/trips/jointrip/:tripId'} component={JoinTrip} />
                <Route exact path ="/" component={UserDashboard} />
                <Route exact path ="/home" component={UserDashboard} />
                <Route exact path="/flights/:tripId/:userId" component={Flights} />
                <Route exact path="/hotels/:tripId" component={Hotels} />
                <Route path="/trip/:tripId" component={TripDashboard} />
              </Switch>
            }
            {/* Displays our Login component as a fallback */}
            <Route component={Login} />
          </Switch>
        </Main>
      </Router>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = (dispatch) => {
  return {
    loadInitialData () {
      dispatch(me())
    }
  }
}

export default connect(mapState, mapDispatch)(Routes)

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
