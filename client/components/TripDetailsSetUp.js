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
      newUsers: []
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
      name: this.props.trip.name,
      arrivalDate: this.refs.arrival.state.value,
      departureDate: this.refs.departure.state.value,
      defaultBudget: event.target.defaultBudget.value,
      joined: true
    }
    this.props.updateTripInfo(tripId, trip)
    history.push(`/flights/${tripId}/${userId}`)
  }

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
  var organizer = {
    email: this.props.user.email,
    id: Number(this.props.match.params.tripId),
    organizer: true,
    joined: true
    }
    this.props.addOrganizer(organizer)
  }

  updateOrganizer = event => {
    event.preventDefault()

  }

  render(){
    const past = {before: new Date()}
    const {friendEmails} = this.state
    return (
            <div className="createTrip-container">
              <div className="createTrip-inner-container">
              <h1>Trip Details for {this.props.trip.name}</h1>

              <form onSubmit={this.addFriend}>
                <label htmlFor="emails">Invite your friends:</label>
                <input
                  id="emails"
                  name="emails"
                  onChange={this.handleChange}
                />
                <button type="submit">+</button>
              </form>
              {
                friendEmails.map(friend =>{
                  return (
                          <h2 key={friend}>{friend}</h2>
                          )
                })
              }
              <form onSubmit={this.changeTrip}>
              <h3>The default budget for this trip is {this.props.trip.defaultBudget}</h3>
              <label>Update budget:</label>
              <input
              required
              id="defaultBudget"
              name="defaultBudget"
              />
              <p>(*your friends can adjust their budget once they join the trip!)</p>
              <label>Pick your dates:</label>
              <DayPickerInput
                dayPickerProps={{disabledDays: past}}
                name="startingDate"
                ref="arrival"
                onDayClick={this.handleDayClick}
                selectedDays={this.state.selectedDay}
                required
              />
              <DayPickerInput
                disabledDays={{ before: past }}
                name="endingDate"
                ref="departure"
                onDayClick={this.handleDayClick}
                selectedDays={this.state.selectedDay}
                required
              />
              <br/>
              <button type="submit">Invite your friends!</button>
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
