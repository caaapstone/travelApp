import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import axios from 'axios'
import bluebird from 'bluebird'

/**
 * COMPONENT
 */

class Flights extends Component {
  constructor() {
    super()

    this.state = {
      tripId: '',
      tripName: '',
      departure: '2018-03-02',
      duration: 4,
      usersOnTrip: [],
      possibleCities: []
    }

    this.findFlights = this.findFlights.bind(this)
    this.filterFlights = this.filterFlights.bind(this)
  }

  componentDidMount() {
    this.setState({tripId: this.props.match.params.tripId})
    axios.get('/api/flights/tripinfo', {
      params: {tripId: this.props.match.params.tripId}
    })
    .then(response => {
      let tripInfo = response.data
      let usersOnTrip = []
      tripInfo.memberships.forEach(member => {
        usersOnTrip.push({
          name: member.user.firstName + ' ' + member.user.lastName,
          origin: member.userCity,
          budget: member.flightBudget,
          ready: false,
          userId: member.userId
        })
      })

      this.setState({
        departure: tripInfo.arrivalDate,
        duration: tripInfo.duration,
        usersOnTrip: usersOnTrip,
        tripName: tripInfo.name
      })
    })
  }

  findFlights() {
    let allFlights = []
    for (var i = 0; i < this.state.usersOnTrip.length; i++) {
      let userId = this.state.usersOnTrip[i].userId
      let params = {
        origin: this.state.usersOnTrip[i].origin,
        departure_date: '2018-03-02',
        duration: 4,
        max_price: this.state.usersOnTrip[i].budget,
        userId: userId,
        tripId: 1
      }

      axios.get('/api/flights/trip', {
        params: params
      })
      .then(() => {
        axios.get('/api/flights', {
          params: {
            tripId: 1,
            userId: userId
          }
        })
        .then(results => {
          allFlights.push(results.data)

          if (allFlights.length === this.state.usersOnTrip.length) {
            this.filterFlights(allFlights)
          }
        })
      })
    }
  }

  filterFlights(flightArr) {
    let cityOptions = {}
    let destinations = []
    flightArr.forEach(userFlights => {
      userFlights.forEach(flight => {
        if (cityOptions[flight.city] > 0) {
          cityOptions[flight.city] = cityOptions[flight.city] + 1
        } else {
          cityOptions[flight.city] =  1
        }
      })
    })
    // REVIEW: for/in not best practice in JS
    //    Object.keys/Object.values/Object.entries
    for(var destination in cityOptions) {
      if (cityOptions[destination] === this.state.usersOnTrip.length) {
        destinations.push(destination)
      }
    }
    console.log('State Updated: ', destinations)
    // REVIEW: this method name is a bit confusing: command vs query
    // REVIEW: does this stuff really fit IN the component?
    //  would it be better suited as thunk, or somewhere else entirely?
    axios.post('/api/destinations', {
      possibleCities: destinations,
      possible: true,
      tripId: 1
    })
    this.setState({possibleCities: destinations})
  }


  render() {
    return (
      <div>
        <div id="flight-search-header">
          <h1 className="capitalized-header">{this.state.tripName.toUpperCase()}</h1>
          <div id="flight-page-members">
            {
              this.state.usersOnTrip.map(user => (
                <div className="flight-page-member-icon" key={user.name}>
                  {user.name}
                </div>
              ))
            }
          </div>
        </div>
        <button onClick={this.findFlights}>Where Can We Go?</button>
        {
          this.state.possibleCities.length
            ? this.state.possibleCities.map(city => (
              <p key={city}>{city}</p>
            ))
            : ''
        }
      </div>
    )
  }
}

/**
 * CONTAINER
 */

const mapStateToProps = ({}, ownProps) => {
  const tripId = Number(ownProps.match.params.tripId)
  return {
    tripId
  }
}

export default withRouter(connect(mapStateToProps)(Flights))
