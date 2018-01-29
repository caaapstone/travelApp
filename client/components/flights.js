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
      activeUser: {},
      activeUserPossibleCities: [],
      airPortCodes: {
        '6A':	'AVIACSA',
        '9K':	'Cape Air',
        A0:	'L\'Avion',
        A7:	'Air Plus Comet',
        AA:	'American',
        AC:	'Air Canada',
        AF:	'Air France',
        AI:	'Air India',
        AM:	'Aeromexico',
        AR:	'Aerolineas Argentinas',
        AS:	'Alaska',
        AT:	'Royal Air Maroc',
        AV:	'Avianca',
        AY:	'Finnair',
        AZ:	'Alitalia',
        B6:	'JetBlue',
        BA:	'British Airways',
        BD:	'bmi british midland',
        BR:	'EVA Airways',
        C6:	'CanJet Airlines',
        CA:	'Air China',
        CI:	'China',
        CO:	'Continental',
        CX:	'Cathay',
        CZ:	'China Southern',
        DL:	'Delta',
        EI:	'Aer Lingus',
        EK:	'Emirates',
        EO:	'EOS',
        F9:	'Frontier',
        FI:	'Icelandair',
        FJ:	'Air Pacific',
        FL:	'AirTran',
        G4:	'Allegiant',
        GQ:	'Big Sky',
        HA:	'Hawaiian',
        HP:	'America West',
        HQ:	'Harmony',
        IB:	'Iberia',
        JK:	'Spanair',
        JL:	'JAL',
        JM:	'Air Jamaica',
        KE:	'Korean',
        KU:	'Kuwait',
        KX:	'Cayman',
        LA:	'LanChile',
        LH:	'Lufthansa',
        LO:	'LOT',
        LT:	'LTU',
        LW:	'Pacific Wings',
        LX:	'SWISS',
        LY:	'El Al',
        MA:	'MALEV',
        MH:	'Malaysia',
        MU:	'China Eastern',
        MX:	'Mexicana',
        NH:	'ANA',
        NK:	'Spirit',
        NW:	'Northwest',
        NZ:	'Air New Zealand',
        OS:	'Austrian',
        OZ:	'Asiana',
        PN:	'Pan American',
        PR:	'Philippine',
        QF:	'Qantas',
        QK:	'Air Canada Jazz',
        RG:	'VARIG',
        SA:	'South African',
        SK:	'SAS',
        SN:	'SN Brussels',
        SQ:	'Singapore',
        SU:	'Aeroflot',
        SY:	'Sun Country',
        TA:	'Taca',
        TG:	'Thai',
        TK:	'Turkish',
        TN:	'Air Tahiti Nui',
        TP:	'TAP',
        TS:	'Air Transat',
        U5:	'USA 3000',
        UA:	'United',
        UP:	'Bahamasair',
        US:	'US Air',
        V3:	'Copa',
        VS:	'Virgin Atlantic',
        VX:	'Virgin America',
        WA:	'Western',
        WN:	'Southwest',
        WS:	'WestJet',
        XE:	'ExpressJet',
        Y2:	'Globespan',
        Y7:	'Silverjet',
        YV:	'Mesa',
        YX:	'Midwest',
        ZK:	'Great Lakes'
      }
    }

    this.findFlights = this.findFlights.bind(this)
    this.filterFlights = this.filterFlights.bind(this)
    this.getDestinationCities = this.getDestinationCities.bind(this)

  }

  componentDidMount() {
    const {user} = this.props
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
    })

    //need to map userId to active user
    axios.get('/api/flights/activeusercities', {
      params: {
        tripId: this.props.match.params.tripId,
        userId: 1
      }
    })
    .then(results => {
      this.setState({activeUserPossibleCities: results.data})
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
                      </div>
                      <div className="center-vertically">
                        <button>Select This Destination</button>
                      </div>
                    </div>
                    <div className="flight-options">
                    {
                      this.state.activeUserPossibleCities.length
                        ? this.state.activeUserPossibleCities.filter(flight => flight.city === city.airport).map(flight => (
                          <p key={flight.id}>{`Fly ${this.state.airPortCodes[flight.airline]} from $${flight.cost}`}</p>
                        ))
                        : 'Flight Details Loading'
                    }
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

const mapStateToProps = ({user}, ownProps) => {
  const tripId = Number(ownProps.match.params.tripId)
  return {
    tripId,
    user
  }
}

export default withRouter(connect(mapStateToProps)(Flights))
