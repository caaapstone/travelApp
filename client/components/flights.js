import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import axios from 'axios'
import { setTimeout } from 'timers';
import history from '../history'
import {fetchTripInfo, fetchUsersOnTrip, fetchDestinationCities, fetchActiveUserFlights} from '../store'
import Loading from 'react-loading-components'

/**
 * COMPONENT
 */

class Flights extends Component {
  constructor(props) {
    super(props)

    this.state = {
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
      },
      loading: false
    }

    this.findFlights = this.findFlights.bind(this)
    this.filterFlights = this.filterFlights.bind(this)
    this.getDestinationCities = this.getDestinationCities.bind(this)
    this.upVote = this.upVote.bind(this)
    this.upVoteError = this.upVoteError.bind(this)
    this.upVoteErrorClear = this.upVoteErrorClear.bind(this)
    this.selectCity = this.selectCity.bind(this)
    this.updateFlights = this.updateFlights.bind(this)
    this.whereCanWeGo = this.whereCanWeGo.bind(this)
    this.whereError = this.whereError.bind(this)
    this.whereClear = this.whereClear.bind(this)
    this.toggleLoading = this.toggleLoading.bind(this)
    this.upVoteMessage = this.upVoteMessage.bind(this)
    this.upVoteMessageClear = this.upVoteMessageClear.bind(this)

  }

  componentDidMount() {
    const {getTripInfo, getUsersOnTrip, getDestinationCities, getUserFlights} = this.props
    getTripInfo(this.props.match.params.tripId)
    getUsersOnTrip(this.props.match.params.tripId)
    getDestinationCities(this.props.match.params.tripId)
    getUserFlights(this.props.match.params.tripId, this.props.match.params.userId)
  }

  componentWillUnmount() {
    const {getDestinationCities, getUserFlights} = this.props
    getDestinationCities()
    getUserFlights()
  }

  findFlights() {
    this.setState({loading: true})
    let allFlights = []
    const {usersOnTrip} = this.props
    for (var i = 0; i < usersOnTrip.length; i++) {
      let userId = usersOnTrip[i].userId
      let params = {
        origin: usersOnTrip[i].origin,
        departure_date: this.props.departure,
        duration: this.props.duration,
        max_price: usersOnTrip[i].budget,
        userId: userId,
        tripId: this.props.match.params.tripId
      }

      axios.get('/api/flights/trip', {
        params: params
      })
      .then(() => {
        axios.get('/api/flights', {
          params: {
            tripId: this.props.match.params.tripId,
            userId: userId
          }
        })
        .then(results => {
          allFlights.push(results.data)

          if (allFlights.length === usersOnTrip.length) {
            this.filterFlights(allFlights)
          }
        })
      })
    }
  }

  updateFlights() {
    this.setState({loading: true})
    const {getUsersOnTrip} = this.props
    axios.post('/api/destinations/clearupvotes', {
      tripId: this.props.match.params.tripId
    })
      .then(() => {
        getUsersOnTrip(this.props.match.params.tripId)
      })
      .then(() => {
        this.findFlights()
      })
  }

  filterFlights(flightArr) {
    const {getUserFlights} = this.props
    let cityOptions = {}
    let destinations = []
    const {usersOnTrip} = this.props
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
      if (cityOptions[destination] === usersOnTrip.length) {
        destinations.push(destination)
      }
    }
    axios.post('/api/destinations', {
      possibleCities: destinations,
      possible: true,
      tripId: this.props.match.params.tripId
    })
    .then((response) => {
      setTimeout(this.getDestinationCities, 1000)
      setTimeout(this.toggleLoading, 1500)
    })
    .then(() => {
      getUserFlights(this.props.match.params.tripId, this.props.match.params.userId)
    })
  }

  getDestinationCities() {
    const {getDestinationCities} = this.props
    getDestinationCities(this.props.match.params.tripId)
  }

  upVote(e) {
    const {getUsersOnTrip} = this.props
    let city = e.target.value
    axios.post('/api/destinations/upvote', {
      airport: e.target.value,
      userId: this.props.match.params.userId,
      tripId: this.props.match.params.tripId
    })
    .then(result => {
      console.log(result)
      if(result.status === 401) {
        this.upVoteError()
      } else{
        this.upVoteMessage(city)
        setTimeout(this.getDestinationCities, 1000)
      }
    })
    .then(() => {
      getUsersOnTrip(this.props.match.params.tripId)
    })
    .catch(err => {
      console.error(err)
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

  whereError() {
    let errorPopup = document.getElementById('where_error')

    errorPopup.style.visibility = 'visible'
    errorPopup.style.opacity = 1

    setTimeout(this.whereClear, 3000)
  }

  whereClear() {
    let errorPopup = document.getElementById('where_error')

    errorPopup.style.visibility = 'hidden'
    errorPopup.style.opacity = 0
  }

  selectCity(e){
    const {getTripInfo} = this.props
    let destination = e.target.value.split('-')
    axios.post('/api/flights/setcity', {
      tripId: this.props.match.params.tripId,
      city: destination[0],
      state: destination[1]
    })
    .then(result => {
      getTripInfo(this.props.match.params.tripId)
      history.push(`/trip/${this.props.match.params.tripId}`)
    })
  }

  whereCanWeGo(){
    const {usersOnTrip} = this.props
    let joined = 0

    usersOnTrip.forEach(user => {
      if (user.joined === true) {
        joined++
      }
    })

    if(usersOnTrip.length === joined) {
      this.findFlights()
    } else {
      this.whereError()
    }
  }

  toggleLoading() {
    this.setState({loading: false})
  }

  upVoteMessage(city) {
    let upvote = document.getElementById('upvote-confirmed')
    upvote.innerText = `You voted for ${city}!`

    upvote.style.visibility = 'visible'
    upvote.style.opacity = 1

    setTimeout(this.upVoteMessageClear, 3000)
  }

  upVoteMessageClear() {
    let upvote = document.getElementById('upvote-confirmed')

    upvote.style.visibility = 'hidden'
    upvote.style.opacity = 0
  }

  render () {
    const {tripName, usersOnTrip, possibleCities, userFlights, lastUpdated, trip, getUserFlights} = this.props
    let organizer = usersOnTrip.filter(user => user.userId === Number(this.props.match.params.userId))

    if (trip.destinationCity) {
      history.push(`/trip/${this.props.match.params.tripId}/mytrip`)
    }

    if (userFlights.length === 0) {
      getUserFlights(this.props.match.params.tripId, this.props.match.params.userId)
    }

    return (
      <div className="two-rem-padding">
        <div id="flight-search-header">
          <h2 className="capitalized-header">{tripName.toUpperCase()}</h2>
          <div id="flight-page-members">
            {
              usersOnTrip.map(user => (
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
        <div id="where_error">
          <i className="fa fa-times-circle"/>
           Waiting for all users to join this trip.
        </div>
        <div id="upvote-confirmed">
          You voted for ~CITY~ :)
        </div>
        {
          possibleCities.length
            ? (organizer.length && organizer[0].organizer)
              ? <div className="get-flights-div">
                <p>Flight information was last updated on: {lastUpdated}</p>
                <button onClick={this.updateFlights} className="button">Update Flight Data</button>
              </div>
              : <div className="get-flights-div">
                <p>Flight information was last updated on: {lastUpdated}</p>
              </div>
            : (organizer.length && organizer[0].organizer)
              ? <div className="get-flights-div">
                <button onClick={this.whereCanWeGo} className="button">Where Can We Go?</button>
              </div>
              : <div className="get-flights-div">
                <p>Waiting for everyone to accept their invitations.</p>
              </div>
        }
        {
          this.state.loading
          ? <div className="text-align-center">
            <Loading type="puff" width={200} height={200} fill="#7E4E60" className="center-loading"/>
            </div>
          : possibleCities.length
            ? <div>
              {possibleCities.map(city => (
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
                                <button value={`${city.city}-${city.state}`} onClick={this.selectCity} className="button-outline">Select This Destination</button>
                                <br />
                                <button onClick={this.upVote} value={city.airport} className="button-outline">Vote For This Destination</button>
                              </div>
                            : <button onClick={this.upVote} value={city.airport} className="button-outline">Vote For This Destination</button>
                        }
                      </div>
                    </div>
                    <div className="flight-options">
                    {
                      userFlights.length
                        ? userFlights.filter(flight => flight.city === city.airport).map(flight => (
                          <p key={flight.id}>{`Fly ${this.state.airPortCodes[flight.airline]} from $${flight.cost}`}</p>
                        ))
                        : 'Flight Details Loading'
                    }
                    </div>
                    <div className = "flight-options">
                      {
                        possibleCities.filter(possibleCity => possibleCity.airport === city.airport).length
                          ? possibleCities.filter(possibleCity => possibleCity.airport === city.airport)[0].upVote === null
                            ? <p>Upvotes: 0</p>
                            : <p>Upvotes: {possibleCities.filter(possibleCity => possibleCity.airport === city.airport)[0].upVote}</p>
                          : <p>Upvotes: 0</p>
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
            :  (organizer.length && organizer[0].organizer)
              ? <div id="search-for-flights">
                <h2 className="two-rem-padding center-header">Search for flights to see where your crew can go.</h2>
              </div>
              : <div id="search-for-flights">
                <h2 className="two-rem-padding center-header">Once everyone joins your trip and your organizer searches for flights your possible destinations will show up here.</h2>
              </div>
        }
      </div>
    )
  }
}

/**
 * CONTAINER
 */

const mapStateToProps = ({user, trip, users, destinations, userFlights}, ownProps) => {
  const tripId = Number(ownProps.match.params.tripId)
  let tripName = ''
  let departure = ''
  let duration = 0
  let lastUpdated = ''

  if (trip.id) {
    tripName = trip.name
    departure = trip.arrivalDate
    duration = trip.duration
  }

  if (destinations.length) {
    let updated = destinations[0].updatedAt.slice(0, 10).split('-')
    lastUpdated = `${updated[1]}/${updated[2]}/${updated[0]}`
  }

  if (user.id) {
    if (user.id !== Number(ownProps.match.params.userId)) {
      history.push(`/flights/${tripId}/${user.id}`)
    }
  }

  return {
    tripId,
    user,
    tripName,
    departure,
    duration,
    usersOnTrip: users,
    possibleCities: destinations,
    userFlights,
    lastUpdated,
    trip
  }
}

const mapDispatch = (dispatch) => {
  return {
    getTripInfo(tripId){
      dispatch(fetchTripInfo(tripId))
    },
    getUsersOnTrip(tripId){
      dispatch(fetchUsersOnTrip(tripId))
    },
    getDestinationCities(tripId){
      dispatch(fetchDestinationCities(tripId))
    },
    getUserFlights(tripId, userId){
      dispatch(fetchActiveUserFlights(tripId, userId))
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatch)(Flights))
