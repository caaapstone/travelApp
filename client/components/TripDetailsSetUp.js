import React, {Component} from 'react'
import {connect} from 'react-redux'
import users from '../store'
import {postMembership, fetchTrip, getUsersByEmail, updateTrip} from '../store'
import DayPickerInput from 'react-day-picker/DayPickerInput'

/**
 * COMPONENT
 */
 export class TripDetailsSetUp extends Component {
  constructor(props){
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
    // this.props.getUsers()
  }

/** CALENDAR PICKER **/
  handleDayClick = day => {
    this.setState({ selectedDay: day });
  }

/** ADD FRIENDS **/
  changeTrip = (event) =>{
    event.preventDefault()
    let tripId = this.props.match.params.tripId
    let trip = {
      name: this.props.trip.name,
      arrivalDate: this.refs.arrival.state.value,
      departureDate: this.refs.departure.state.value,
      defaultBudget: event.target.defaultBudget.value
    }
    this.props.updateTripInfo(tripId, trip)
  }

  handleChange = event => {
    const search = event.target.value
    this.setState({email: search})
  }

  addFriend = event => {
    event.preventDefault()
        if (this.state.email) {
            this.setState({friendEmails: [...this.state.friendEmails, this.state.email
          ]})
        this.props.getUsers({email: this.state.email, id: this.props.match.params.tripId})
    }
  }

/** UPDATE TRIP WITH NEW INFORMATION **/
  // submitTrip = (event) =>{
  //   event.preventDefault()
  //   let trip = {
  //     arrivalDate: this.refs.arrival.state.value,
  //     departureDate: this.refs.departure.state.value,
  //     defaultBudget: event.target.defaultBudget.value
  //   }
  //   this.props.createTrip(trip)

  // }

  render(){
    const {friendEmails} = this.state
    return (
            <div>
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
                        <h2>{friend}</h2>
                        )
              })
            }
            <form onSubmit={this.changeTrip}>
            <h3>The current budget for this trip is {this.props.trip.defaultBudget}</h3>
            <label>Update budget:</label>
            <input
            id="defaultBudget"
            name="defaultBudget"
            />
            <p>(*your friends can adjust their budget once they join the trip!)</p>
            <label>Pick your dates:</label>
            <DayPickerInput name="startingDate" ref="arrival" onDayClick={this.handleDayClick} selectedDays={this.state.selectedDay} />
            <DayPickerInput name="endingDate" ref="departure" onDayClick={this.handleDayClick} selectedDays={this.state.selectedDay} />

            <button type="submit">Invite your friends!</button>
            </form>
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
      getTrip: (tripId) =>{
        dispatch(fetchTrip(tripId))
      },
      getUsers: email =>{
        dispatch(getUsersByEmail(email))
      },
      updateTripInfo: (tripId, tripInfo) => {
        dispatch(updateTrip(tripId, tripInfo))
      }
    }
  }

  export default connect(mapState, mapDispatch)(TripDetailsSetUp)


//add trip ID to user
