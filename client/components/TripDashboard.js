import React, {Component} from 'react'
import {connect} from 'react-redux'
import {CalendarBoard, MapBoard, IdeaBoard, Hotels, Itinerary, DemoPopUp} from '../components'
import {fetchTrip, fetchUsersOnTrip} from '../store'
import {Route, Switch, NavLink} from 'react-router-dom'
import Modal from 'react-responsive-modal'


class TripDashboard extends Component {

  constructor(props) {
    super(props)
    this.state = {
      demoPopUp: false
    }
    this.onCloseModal = this.onCloseModal.bind(this)
    this.dateRange = this.dateRange.bind(this)
  }

  componentDidMount(){
    const {getUsersOnTrip, currentUser} = this.props
    let tripId = this.props.match.params.tripId
    if (!this.props.trip.name){
      this.props.getTripInfo(tripId)
    }
    if (currentUser.id === 31){
      this.setState({...this.state, demoPopUp: true})
    }
    getUsersOnTrip(this.props.match.params.tripId)
  }

  dateRange(arrival, departure) {
    arrival = arrival.split('-')
    departure = departure.split('-')
    return `${arrival[1]}/${arrival[2]}/${arrival[0]} - ${departure[1]}/${departure[2]}/${departure[0]}`
  }

  onCloseModal(){
    this.setState({...this.state, demoPopUp: false})
  }

  render(){
    const { trip, usersOnTrip } = this.props;

    return (
      <div>
        <Modal open={this.state.demoPopUp} onClose={this.onCloseModal} little>
          <DemoPopUp />
        </Modal>
      <div id="trip-dashboard-flex-header">
      {
        this.props.trip.arrivalDate
          ? <h1>{`${this.props.trip.name} (${this.dateRange(this.props.trip.arrivalDate, this.props.trip.departureDate)})`}</h1>
          : <h1>{this.props.trip.name}</h1>
      }
      <div>
      <div id="flight-page-members">
            {
              usersOnTrip
              ? usersOnTrip.map(user => (
                <div className="flight-page-member-icon" key={user.name}>
                  {user.name}
                  <span className="member-info-text">
                    <p><span className="bold">Origin: </span>{user.origin}</p>
                    <p><span className="bold">Joined Group: </span>
                      {
                        user.joined
                          ? <span className="green bold">&#10004;</span>
                          : <span className="red bold">&#10007;</span>
                      }
                    </p>
                    <p><span className="bold">Flight Booked: </span>
                      {
                        user.flightBooked
                          ? <span className="green bold">&#10004;</span>
                          : <span className="red bold">&#10007;</span>
                      }
                    </p>
                </span>
                </div>
              ))
              : <div />
            }
          </div>
          </div>
        </div>
      <div className="trip-dashboard-nav">
        <NavLink to={`/trip/${trip.id}/mytrip`} className="nav-link">My Trip</NavLink>
        <NavLink to={`/trip/${trip.id}/ideas`} className="nav-link">Idea Board</NavLink>
        <NavLink to={`/trip/${trip.id}/calendar`} className="nav-link">Schedule</NavLink>
        <NavLink to={`/trip/${trip.id}/map`} className="nav-link">Map</NavLink>
        <NavLink to={`/trip/${trip.id}/itinerary`} className="nav-link">Itinerary</NavLink>
      </div>
      <Switch>
        <Route exact path="/trip/:tripId/" component={Hotels} />
        <Route path="/trip/:tripId/mytrip" component={Hotels} />
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
    trip: state.trip,
    usersOnTrip: state.users,
    currentUser: state.user
  }
}

let mapDispatchToProps = dispatch => {
  return {
    getTripInfo(tripId){
      dispatch(fetchTrip(tripId))
    },
    getUsersOnTrip(tripId){
      dispatch(fetchUsersOnTrip(tripId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TripDashboard)
