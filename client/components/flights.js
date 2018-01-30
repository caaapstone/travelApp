import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import axios from 'axios'
import bluebird from 'bluebird'
import { setTimeout } from 'timers';
import history from '../history'
import me from '../store/user'

/**
 * COMPONENT
 */

class Flights extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tripId: '',
      tripName: '',
      departure: '',
      duration: 0,
      usersOnTrip: [],
      possibleCities: [],
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
    this.upVote = this.upVote.bind(this)
    this.upVoteError = this.upVoteError.bind(this)
    this.upVoteErrorClear = this.upVoteErrorClear.bind(this)
    this.selectCity = this.selectCity.bind(this)

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
          userId: member.userId,
          organizer: member.organizer,
          joined: member.joined,
          flightBooked: member.flightBooked,
          upVotes: member.upVotes
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
      setTimeout(this.getDestinationCities, 1000)
    })

    axios.get('/api/flights/activeusercities', {
      params: {
        tripId: this.props.match.params.tripId,
        userId: this.props.match.params.userId
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
    .then(() => {
      axios.get('/api/flights/activeusercities', {
        params: {
          tripId: this.props.match.params.tripId,
          userId: this.props.match.params.userId
        }
      })
      .then(results => {
        this.setState({activeUserPossibleCities: results.data})
      })
    })
  }

  getDestinationCities() {
    axios.get('/api/destinations/possiblecities', {
      params: {tripId: this.state.tripId}
    })
    .then(results => {
      let updatedCities = results.data
      let sortedCities = updatedCities.sort(function(a, b) {
        return Number(b.upVote) - Number(a.upVote)
      })
      this.setState({possibleCities: sortedCities})
    })
  }

  upVote(e) {
    axios.post('/api/destinations/upvote', {
      airport: e.target.value,
      userId: this.props.match.params.userId,
      tripId: this.props.match.params.tripId
    })
    .then(result => {
      if(result.status === 401) {
        console.log('You\'ve used all of your votes')
      } else{
        setTimeout(this.getDestinationCities, 1000)
      }
    })
    .then(() => {
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
            userId: member.userId,
            organizer: member.organizer,
            joined: member.joined,
            flightBooked: member.flightBooked,
            upVotes: member.upVotes
          })
        })

        this.setState({
          usersOnTrip: usersOnTrip
        })
      })
    })
    .catch(err => {
      console.log(err)
      this.upVoteError()
    })
  }

  upVoteError() {
    let errorPopup = document.getElementById('isa_error')

    errorPopup.style.visibility = 'visible'
    errorPopup.style.opacity = 1

    setTimeout(this.upVoteErrorClear, 3000)
  }

  upVoteErrorClear() {
    let errorPopup = document.getElementById('isa_error')

    errorPopup.style.visibility = 'hidden'
    errorPopup.style.opacity = 0
  }

  selectCity(e){
    let destination = e.target.value.split('-')
    console.log(destination)
    axios.post('/api/flights/setcity', {
      tripId: this.props.match.params.tripId,
      city: destination[0],
      state: destination[1]
    })
    .then(result => {
      console.log(result)
      // updateTripCity(result.data)
    })
  }

  render() {
    let organizer = this.state.usersOnTrip.filter(user => user.userId === Number(this.props.match.params.userId))
    return (
      <div>
        <div id="flight-search-header">
          <h1 className="capitalized-header">{this.state.tripName.toUpperCase()}</h1>
          <div id="flight-page-members">
            {
              this.state.usersOnTrip.map(user => (
                <div className="flight-page-member-icon" key={user.name}>
                  {user.name}
                  <span className="member-info-text">
                    <p><span className="bold">Origin: </span>{user.origin}</p>
                    <p><span className="bold">Joined Group: </span>
                      {
                        user.joined
                          ? <span className="green bold">&#10004;</span>
                          : <span className="red bold">&#10007;</span>
                      }
                    </p>
                    <p><span className="bold">Votes In: </span>
                      {
                        user.upVotes < 3
                          ? <span className="green bold">&#10004;</span>
                          : <span className="red bold">&#10007;</span>
                      }
                    </p>
                    <p><span className="bold">Flight Booked: </span>
                      {
                        user.flightBooked
                          ? <span className="green bold">&#10004;</span>
                          : <span className="red bold">&#10007;</span>
                      }
                    </p>
                </span>
                </div>
              ))
            }
          </div>
        </div>
        <div id="isa_error">
          <i className="fa fa-times-circle"/>
           You've Already Voted 3 Times
        </div>
        {
          this.state.possibleCities.length
            ? <div className="get-flights-div">
              <button onClick={this.findFlights}>Update Flight Data</button>
            </div>
            : <div className="get-flights-div">
              <button onClick={this.findFlights}>Where Can We Go?</button>
            </div>
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
                        {
                          (organizer.length && organizer[0].organizer)
                            ? <div>
                                <button value={`${city.city}-${city.state}`} onClick={this.selectCity}>Select This Destination</button>
                                <br />
                                <button onClick={this.upVote} value={city.airport}>Vote For This Destination</button>
                              </div>
                            : <button onClick={this.upVote} value={city.airport}>Vote For This Destination</button>
                        }
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
                    <div className = "flight-options">
                      {
                        this.state.possibleCities.filter(possibleCity => possibleCity.airport === city.airport).length
                          ? this.state.possibleCities.filter(possibleCity => possibleCity.airport === city.airport)[0].upVote === null
                            ? <p>Upvotes: 0</p>
                            : <p>Upvotes: {this.state.possibleCities.filter(possibleCity => possibleCity.airport === city.airport)[0].upVote}</p>
                          : <p>Upvotes: 0</p>
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

// const mapDispatch = (dispatch) => {
//   return {
//     updateTripCity(destination){
//       dispatch(addDestination(destination))
//     }
//   }
// }

export default withRouter(connect(mapStateToProps)(Flights))
