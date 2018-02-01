import React, {Component} from 'react'
import {connect} from 'react-redux'
import { postTrip } from '../store'
import history from '../history'

/**
 * COMPONENT
 */
 export class CreateTrip extends Component {

  submitTrip = (event) =>{
    event.preventDefault()
    let trip = {
      name: event.target.tripName.value,
    }
    this.props.createTrip(trip)

  }

  render(){

    return (
            <div>
            <h1>Welcome</h1>
            <h2>Start a trip!</h2>
              <form onSubmit={this.submitTrip}>
                <label>Name your trip:</label>
                <input
                  id="tripName"
                  name="tripName"
                />
                <h3>We'll get more details from you once you create your trip</h3>
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
    user: state.user
  }
}

const mapDispatch = (dispatch) => {
  return {
    createTrip: (newTrip) => {
      return dispatch(postTrip(newTrip))
      .then(trip =>{
        let tripId = trip.trip.id
        history.push(`/trips/tripdetailsetup/${tripId}`)
      })
    }
  }
}

export default connect(mapState, mapDispatch)(CreateTrip)

