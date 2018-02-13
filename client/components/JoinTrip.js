import React, {Component} from 'react'
import {connect} from 'react-redux'
import users from '../store'
import {updateMembership, fetchTrip} from '../store'
import history from '../history'
import axios from 'axios'
import Loading from 'react-loading-components'
/**
 * COMPONENT
 */
export class JoinTrip extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      airports: []
    }

    this.airportSelected = this.airportSelected.bind(this)
  }

  submitMembership = (event) =>{
    let tripId = this.props.match.params.tripId
    let userId = this.props.user.id
    event.preventDefault()
    let membership = {
      userCity: event.target.startingCity.value,
      userState: '',
      flightBudget: event.target.flightBudget.value,
      userId: this.props.user.id,
      tripId: this.props.trip.id
    }
    this.props.changeMembership(membership)
    history.push(`/flights/${tripId}/${userId}`)
  }

componentDidMount() {
  let tripId = this.props.match.params.tripId
  this.props.getTrip(tripId)
}

handleCityChange = (evt) => {
  this.setState({ city: evt.target.value })
  this.airportAutoComplete(evt.target.value)
}

airportAutoComplete(str) {
  const airportSearch = str
  if(airportSearch.length >= 3){
    this.setState({isLoading: true})
    axios.get('https://api.sandbox.amadeus.com/v1.2/airports/autocomplete', {
      params: {
        apikey: 'lCBkNzEA1atSXjsWbDvWaIW2lvjPdwAz',
        term: airportSearch
      }
    })
    .then(results => {
      let airportResults = results.data.slice(0,5)
      this.setState({airports: airportResults, isLoading: false})
    })
  } else {
    this.setState({isLoading: false, airports: []})
  }
}

airportSelected(airport) {
  document.getElementById('startingCity').value = airport
  this.setState({airports: []})
}

render(){
  return (
            <div className="createTrip-container">
              <div className="createTrip-inner-container">
            <h1 className="capitalized-header">Trip Details</h1>
            <h3>The budget for this trip is ${this.props.trip.defaultBudget}</h3>
            <form onSubmit={this.submitMembership}>
            <label>You can adjust your personal budget here:</label>
            <input
              className="airline-input"
              id="flightBudget"
              name="flightBudget"
              required
            />
            <label>Where are you flying from?</label>
              <div id="airport-search-container">
              <input
                required
                className="airline-input"
                id="startingCity"
                name="startingCity"
                onChange={this.handleCityChange}
                autocomplete="new-password"
              />
              {
                this.state.isLoading
                  ? <div>
                    <Loading type="puff" width={80} height={80}fill="#7E4E60" className="center-loading" />
                  </div>
                  : this.state.airports.length
                    ? <div className="no-margin three-hundred">
                      {
                        this.state.airports.map(airport => (
                          <div onClick={() => this.airportSelected(airport.value)} className="airport-search-result">
                            <p className="no-margin airport-result-text bold">{airport.value}</p>
                            <p className="no-margin airport-result-text">{airport.label}</p>
                          </div>
                        ))
                      }
                    </div>
                    : <div />
              }
              </div>
            <p/>
            <button className="button center-loading">Join the trip!</button>
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
      changeMembership: (newMembership) => {
          dispatch(updateMembership(newMembership))
      },
      getTrip: tripId =>{
        dispatch(fetchTrip(tripId))
      }
    }
  }

export default connect(mapState, mapDispatch)(JoinTrip)
