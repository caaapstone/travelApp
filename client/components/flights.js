import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import axios from 'axios'
import bluebird from 'bluebird'
import { setTimeout } from 'timers';

/**
 * COMPONENT
 */

class Flights extends Component {
  constructor() {
    super()

    this.state = {
      tripId: '',
      tripName: '',
      departure: '',
      duration: 0,
      usersOnTrip: [],
      possibleCities: [],
      lastUpdate: ''
    }

    this.findFlights = this.findFlights.bind(this)
    this.filterFlights = this.filterFlights.bind(this)
    this.getDestinationCities = this.getDestinationCities.bind(this)
    this.averagePrice = this.averagePrice.bind(this)
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

    axios.get('/api/destinations/possiblecities', {
      params: {tripId: this.props.match.params.tripId}
    })
    .then((response) => {
      let destinations = []
      response.data.forEach(destination => (
        destinations.push(destination)
      ))
      this.setState({
        possibleCities: destinations,
        lastUpdate: destinations[0].updatedAt
      })
      console.log(this.state.lastUpdate)
    })
  }

  findFlights() {
    let allFlights = []
    for (var i = 0; i < this.state.usersOnTrip.length; i++) {
      let userId = this.state.usersOnTrip[i].userId
      let params = {
        origin: this.state.usersOnTrip[i].origin,
        departure_date: this.state.departure,
        duration: this.state.duration,
        max_price: this.state.usersOnTrip[i].budget,
        userId: userId,
        tripId: this.state.tripId
      }

      axios.get('/api/flights/trip', {
        params: params
      })
      .then(() => {
        axios.get('/api/flights', {
          params: {
            tripId: this.state.tripId,
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
    for(var destination in cityOptions) {
      if (cityOptions[destination] === this.state.usersOnTrip.length) {
        destinations.push(destination)
      }
    }
    axios.post('/api/destinations', {
      possibleCities: destinations,
      possible: true,
      tripId: this.state.tripId
    })
    .then((response) => {
      setTimeout(this.getDestinationCities, 2000)
    })
  }

  getDestinationCities() {
    axios.get('/api/destinations/possiblecities', {
      params: {tripId: this.state.tripId}
    })
    .then(results => {
      console.log(results)
      this.setState({possibleCities: results.data})
    })
  }

  averagePrice(airport) {
    console.log('wut')
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
        {
          this.state.possibleCities.length
            ? <button onClick={this.findFlights}>Update Flight Data</button>
            : <button onClick={this.findFlights}>Where Can We Go?</button>
        }
        {
          this.state.possibleCities.length
            ? <div>
              {this.state.possibleCities.map(city => (
                <div key={city.airport} className="possible-city-container">
                  <div>
                    <img src="/airplane.jpg" className="possible-city-image"/>
                    <p className="possible-city-code">{city.airport}</p>
                  </div>
                  <div className="possible-city-info">
                    <div className="flex">
                      <div>
                        <h3>{city.city + ', ' + city.state}</h3>
                        <p>Group's Average Price: $150</p>
                      </div>
                      <div className="center-vertically">
                        <button>Select This Destination</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
