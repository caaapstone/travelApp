import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getAllUsers, postTrip} from '../store'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import { Link } from 'react-router-dom';
import history from '../history'
/**
 * COMPONENT
 */
 export class CreateTrip extends Component {
  constructor(props){
    super()

    this.state = {
      selectedDay: undefined,
      friendEmails: [],
      friendSearch: ''
    }
  }

  componentDidMount(){
    this.props.getUsers()
  }

  handleDayClick = day => {
    this.setState({ selectedDay: day });
  }

  handleChange = event => {
    const search = event.target.value
    this.setState({friendSearch: search})
    console.log("handlechange state", this.state)
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

  addFriend = event => {
    event.preventDefault()
    this.setState({friendEmails: [...this.state.friendEmails, event.target.emails.value]})
  }

  render(){
    const {friendEmails} = this.state
    // if (!this.state.friendSearch) return <div />
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
              {
                //find friends here!!!
              }
              <button type="submit">+</button>
              </form>

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
              console.log(newTrip)
              dispatch(postTrip(newTrip))
              history.push('/jointrip')
            },
            getUsers: () => {
              dispatch(getAllUsers())
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
