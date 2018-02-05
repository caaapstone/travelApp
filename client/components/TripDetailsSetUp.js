import React, {Component} from 'react'
import {connect} from 'react-redux'
import users from '../store'
import { fetchTrip, getUsersByEmail, updateTrip} from '../store'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import history from '../history'

/**
 * COMPONENT
 */
 export class TripDetailsSetUp extends Component {
  constructor(){
    super()

    this.state = {
      selectedDay: undefined,
      friendSearch: '',
      email: '',
      friendEmails: [],
      name: '',
      budget: '',
      arrival: '',
      departure: '',
      city: '',
      state: ''
    }
  }

  componentDidMount() {
    var tripId = this.props.match.params.tripId
    this.props.getTrip(tripId)

  }

/** CALENDAR PICKER **/
  handleDayClick = day => {
    this.setState({ selectedDay: day });
  }
/*Update Trip Details*/
  changeTrip = (event) => {
    event.preventDefault()
    let tripId = this.props.match.params.tripId
    let userId = this.props.user.id
    let trip = {
      name: event.target.tripName.value,
      arrivalDate: event.target.arrival.value,
      departureDate: event.target.departure.value,
      defaultBudget: event.target.defaultBudget.value,
      joined: true
    }
    var organizer = {
      userCity: event.target.startingCity.value,
      userState: event.target.startingState.value,
      flightBudget: event.target.defaultBudget.value,
      email: this.props.user.email,
      id: Number(this.props.match.params.tripId),
      organizer: true,
      joined: true
    }
      this.props.addOrganizer(organizer)
      this.props.updateTripInfo(tripId, trip)
      history.push(`/flights/${tripId}/${userId}`)
    }

/* Prevent Submission */
handleNameChange = (evt) => this.setState({ name: evt.target.value })
handleBudgetChange = (evt) => this.setState({ budget: evt.target.value })
handleArrivalChange = (evt) => this.setState({ arrival: evt.target.value })
handleDepartureChange = (evt) => this.setState({ departure: evt.target.value })
handleCityChange = (evt) => this.setState({ city: evt.target.value })
handleStateChange = (evt) => this.setState({ state: evt.target.value })



/** ADD FRIENDS **/
  handleChange = event => {
    const search = event.target.value
    this.setState({email: search})
  }

  addFriend = event => {
    event.preventDefault()
        if (this.state.email) {
            this.setState({friendEmails: [...this.state.friendEmails, this.state.email
          ]})
        this.props.getUsers({
          email: this.state.email,
          id: Number(this.props.match.params.tripId),
          organizer: false,
          joined: false
        })
    }
    this.setState({email: ''})
  }


  render(){
    const {name, budget, arrival, departure, city, state} = this.state
    const isEnabled =
      name.length > 0 &&
      budget.length > 0 &&
      arrival.length > 0 &&
      departure.length > 0 &&
      city.length > 0 &&
      state.length > 0;

      console.log(isEnabled)

    const past = {before: new Date()}
    const {friendEmails} = this.state
    return (
            <div className="createTrip-container">
              <div className="createTrip-inner-container">
              <h1 className="capitalized-header">Trip Details for {this.props.trip.name}</h1>
              <form onSubmit={this.changeTrip}>
              <label>Name your trip:</label>
                <input
                  required
                  id="tripName"
                  name="tripName"
                  className="airline-input"
                  onChange={this.handleNameChange}
                />
                <label htmlFor="emails">Invite your friends:</label>
                <input
                  value = {this.state.email}
                  className="airline-input"
                  id="emails"
                  name="emails"
                  onChange={this.handleChange}
                />

                <button onClick = {this.addFriend} className="button center-loading">+</button>

              {
                friendEmails.map(friend =>{
                  return (
                          <h2 key={friend}>{friend}</h2>
                          )
                })
              }

              <h3>The default budget for this trip is ${this.props.trip.defaultBudget}</h3>
              <label>Update budget:</label>
              <input
              required
              className="airline-input"
              id="defaultBudget"
              name="defaultBudget"
              onChange={this.handleBudgetChange}
              />
              <p>(*your friends can adjust their budget once they join the trip!)</p>
              <label>Pick your dates:</label>
              <input
                required
                name="arrival"
                type="date"
                onChange={this.handleArrivalChange}
              />
              <input
                required
                name="departure"
                type="date"
                onChange={this.handleDepartureChange}
              />
              <br/>

              <label>Add your starting city and state below:</label>
              <input
                required
                className="airline-input"
                id="startingCity"
                name="startingCity"
                onChange={this.handleCityChange}
              />
              <input
                required
                className="airline-input"
                id="startingState"
                name="startingState"
                onChange={this.handleStateChange}
              />
              <h4>Your friends will add their cities when they join the trip</h4>
              <button id="submitTrip" disabled={!isEnabled} className="button center-loading" type="submit">Invite your friends!</button>

              </form>
              </div>
            </div>
            )
  }
}

  /**
  * CONTAINER
  */
  const mapState = (state) => {
    return {
      user: state.user,
      users: state.users,
      trip: state.trip
    }
  }

  const mapDispatch = (dispatch) => {
    return {
      getTrip: tripId => {
        dispatch(fetchTrip(tripId))
      },
      getUsers: email => {
        dispatch(getUsersByEmail(email))
      },
      updateTripInfo: (tripId, tripInfo) => {
        dispatch(updateTrip(tripId, tripInfo))
      },
      addOrganizer: membership => {
        dispatch(getUsersByEmail(membership))
      }
    }
  }

  export default connect(mapState, mapDispatch)(TripDetailsSetUp)
