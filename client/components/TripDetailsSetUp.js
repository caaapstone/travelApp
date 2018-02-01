import React, {Component} from 'react'
import {connect} from 'react-redux'
import users from '../store'
import {postMembership, fetchTrip, getUsersByEmail} from '../store'
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
  submitMembership = (event) =>{
    event.preventDefault()
    let membership
    this.state.friendEmails.map(friendMembership =>{
      this.props.users.filter(user =>{
        if(friendMembership.email === user.email){
          membership[userId] = user.id
          }
      })
    })
    //     let trip = {
    //   arrivalDate: this.refs.arrival.state.value,
    //   departureDate: this.refs.departure.state.value,
    //   defaultBudget: event.target.defaultBudget.value
    // }
    // this.props.createTrip(trip)
    console.log(membership)
    // this.props.createMembership(membership)
  }

  // handleChange = event => {
  //   const search = event.target.value
  //   this.setState({friendSearch: search})
  // }

    // addFriend = event => {
    //   event.preventDefault()
    //       if (this.state.friendSearch) {
    //           this.setState({friendEmails: [...this.state.friendEmails, this.state.friendSearch
    //         ]})
    //         console.log("add friend state", this.state)
    //       this.props.getUsers(this.state.friendSearch)
    //   }
   // }
  handleChange = event => {
    const search = event.target.value
    this.setState({email: search})
  }
    addFriend = event => {
      event.preventDefault()
          if (this.state.email) {
              this.setState({friendEmails: [...this.state.friendEmails, this.state.email
            ]})
            console.log("add friend state", this.state)
          this.props.getUsers({email: this.state.email})
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

            <button>Invite your friends!</button>
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
      createMembership: (newMembership) => {
        dispatch(postMembership(newMembership))
      }
    }
  }

  export default connect(mapState, mapDispatch)(TripDetailsSetUp)


//add trip ID to user
