import React, {Component} from 'react'
import {connect} from 'react-redux'
import users from '../store'
import {postTrip} from '../store'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import { Link } from 'react-router-dom';
import history from '../history'
/**
 * COMPONENT
 */
export class CreateTrip extends Component {
  constructor(props){
    super()
    // REVIEW: consistency in application of class features
    //  arrow method `submitTrip` vs these handlers
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addFriend = this.addFriend.bind(this);

    this.state = {
      selectedDay: undefined,
      friendEmails: []
    }
  }
  // REVIEW:
  //  lots of messy indentation in this file
    handleDayClick(day) {
    this.setState({ selectedDay: day });
  }

    handleChange(event) {
    console.log(event.target.value)
  }

  submitTrip = (event) =>{
    event.preventDefault()
    let trip = {
      arrivalDate: this.refs.arrival.state.value,
      departureDate: this.refs.departure.state.value,
      defaultBudget: event.target.defaultBudget.value
    }
    this.props.createTrip(trip)
  }

  addFriend = (event) => {
    event.preventDefault()
    this.setState({friendEmails: [...this.state.friendEmails, event.target.emails.value]})
  }

render(){
  const {friendEmails} = this.state
  if (!this.state.friendEmails) return <div />
  return (
          <div>
            <h1>Welcome</h1>
            <form onSubmit={this.addFriend}>
            <label htmlFor="emails">Invite your friends:</label>
            <input
              id="emails"
              name="emails"
              onChange={this.handleChange}
            />
            <button type="submit">+</button>
            </form>
            <ul>
            {
              friendEmails.map(email =>{
                return (
                  <li key={email}>{email}</li>
                        )
              })
            }
            </ul>
            <form onSubmit={this.submitTrip}>
            <label>Pick your dates:</label>
            <DayPickerInput name="startingDate" ref="arrival" onDayClick={this.handleDayClick} selectedDays={this.state.selectedDay} />
            <DayPickerInput name="endingDate" ref="departure" onDayClick={this.handleDayClick} selectedDays={this.state.selectedDay} />
            <label>Choose a budget:</label>
            <input
              id="defaultBudget"
              name="defaultBudget"
            />
            <p>(*your friends can adjust their budget once they join the trip!)</p>
            <button>Create your trip!</button>
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
            users: state.users
          }
        }

        const mapDispatch = (dispatch) => {
          return {
            createTrip: (newTrip) => {
                dispatch(postTrip(newTrip))
                history.push('/jointrip')
            }
          }
        }

        export default connect(mapState, mapDispatch)(CreateTrip)

//POST request for create trip
  //need trip name?
  //arrival date
  //depuarture date
  //put user ID with trip ID on join table

//CHECKOUT REFS!!!!!!
