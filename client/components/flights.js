import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import axios from 'axios'

/**
 * COMPONENT
 */

class Flights extends Component {
  constructor() {
    super()

    this.state = {
      departure: '2018-03-02',
      duration: 4,
      usersOnTrip: [
        {
          name: 'Patrick',
          origin: 'CHI',
          budget: 300,
          ready: true
        },
        {
          name: 'Alexa',
          origin: 'OMA',
          budget: 300,
          ready: true
        },
        {
          name: 'Alyssa VB',
          origin: 'NYC',
          budget: 300,
          ready: true
        },
        {
          name: 'Alyssa D',
          origin: 'PHL',
          budget: 300,
          ready: true
        }
      ]
    }

    this.findFlights = this.findFlights.bind(this)
  }

  findFlights() {
    let params = {
      origin: 'CHI',
      departure_date: '2018-03-02',
      duration: 4,
      max_price: 300,
      userId: 1,
      tripId: 1
    }

    axios.get('/api/flights/trip', {
      params: params
    })
    .then(() => {
      axios.get('/api/flights', {
        params: {
          userId: 1,
          tripId: 1
        }
      })
      .then(results => console.log(results.data))
    })
  }

  render() {
    return (
      <div>
        <h1>Users on Trip</h1>
        <ul>
          {
            this.state.usersOnTrip.map(user => (
              <li key={user.name}>
                {user.name}
              </li>
            ))
          }
        </ul>
        <button onClick={this.findFlights}>Where Can We Go?</button>
      </div>
    )
  }
}

/**
 * CONTAINER
 */

export default withRouter(connect()(Flights))
