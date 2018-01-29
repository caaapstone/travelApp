import React, {Component} from 'react'
import {connect} from 'react-redux'
import users from '../store'
import {postMembership} from '../store'

/**
 * COMPONENT
 */
export class JoinTrip extends Component {

  submitMembership = (event) =>{
    event.preventDefault()
    let membership = {
      userCity: event.target.startingCity.value,
      userState: event.target.startingState.value,
      userId: this.props.user.id,
      flightBudget: event.target.flightBudget.value,
      hotelBudget: event.target.hotelBudget.value,
      tripId: this.props.trip.id
    }
    this.props.createMembership(membership)
  }

  // REVIEW: indentation
  // REVIEW: log messages left in place
render(){
console.log(this.props)
  return (
          <div>
            <h1>Welcome</h1>
            <h3>The budget for this trip is {this.props.trip.defaultBudget}</h3>
            <form onSubmit={this.submitMembership}>
            <label>You can adjust your personal budget here:</label>
            <input
              placeholder= "flight budget"
              id="flightBudget"
              name="flightBudget"
            />
            <input
              placeholder= "hotel budget"
              id="hotellBudget"
              name="hotelBudget"
            />
            <label>Where are you coming from?</label>
            <input
              id="startingCity"
              name="startingCity"
            />
            <input
              id="startingState"
              name="startingState"
            />

            <button>Join the trip!</button>
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
      createMembership: (newMembership) => {
          dispatch(postMembership(newMembership))
      }
    }
  }

export default connect(mapState, mapDispatch)(JoinTrip)


//add trip ID to user
