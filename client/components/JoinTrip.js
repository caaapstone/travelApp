import React, {Component} from 'react'
import {connect} from 'react-redux'
import users from '../store'
import {updateMembership, fetchTrip} from '../store'

/**
 * COMPONENT
 */
export class JoinTrip extends Component {

  submitMembership = (event) =>{
    event.preventDefault()
    let membership = {
      userCity: event.target.startingCity.value,
      userState: event.target.startingState.value,
      flightBudget: event.target.flightBudget.value,
      userId: this.props.user.id,
      tripId: this.props.trip.id
    }
    this.props.changeMembership(membership)
  }

componentDidMount() {
  let tripId = this.props.match.params.tripId
  this.props.getTrip(tripId)
}

render(){
console.log(this.props)
  return (
          <div>
            <h1>Trip Details</h1>
            <h3>The budget for this trip is {this.props.trip.defaultBudget}</h3>
            <form onSubmit={this.submitMembership}>
            <label>You can adjust your personal budget here:</label>
            <input
              placeholder= "flight budget"
              id="flightBudget"
              name="flightBudget"
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
      changeMembership: (newMembership) => {
          dispatch(updateMembership(newMembership))
      },
      getTrip: tripId =>{
        dispatch(fetchTrip(tripId))
      }
    }
  }

export default connect(mapState, mapDispatch)(JoinTrip)
