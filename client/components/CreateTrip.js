import React, {Component} from 'react'
import {connect} from 'react-redux'
import { postTrip } from '../store'
import history from '../history'

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
            <div className="createTrip-container">
            <div className="createTrip-inner-container">
            <h1 className="capitalized-header">Welcome</h1>
            <h2>Start a trip!</h2>
              <form onSubmit={this.submitTrip}>
                <label>Name your trip:</label>
                <input
                  id="tripName"
                  name="tripName"
                  className="airline-input"
                />
                <h3>We'll get more details from you once you create your trip</h3>
                <button className="button center-loading">Create your trip!</button>
              </form>
              </div>
            </div>
            )
  }
}

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
