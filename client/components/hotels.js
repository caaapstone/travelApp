import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import axios from 'axios'
import mapboxgl from 'mapbox-gl'
import {fetchTripInfo, getHotels, fetchUsersOnTrip, setUserHotel, fetchUserHotel} from '../store'
import { setTimeout } from 'timers';

/**
 * COMPONENT
 */

class Hotels extends Component {
  constructor(props) {
    super(props)

    this.state = {
      centerCoordinates: [-87.6354, 41.8885],
      possibleHotels: [],
      selectedHotel: {},
      hotelMarkerSet: false,
      getHotel: true
    }

    this.hotelSearch = this.hotelSearch.bind(this)
    this.flightInfo = this.flightInfo.bind(this)
    this.selectHotel = this.selectHotel.bind(this)
  }

  componentDidMount() {
    const {trip, users, getTripInfo, getUsersOnTrip} = this.props

    if (!trip.id) {
      getTripInfo(this.props.match.params.tripId)
    }

    if (users.length === 0) {
      getUsersOnTrip(this.props.match.params.tripId)
    }

    let token = 'pk.eyJ1IjoiYW1iaWwiLCJhIjoiY2pkMHNvaXp2MzhhdTJ4cngzMzk5dTJyMSJ9.BGoNBLsg0yW4Sswk3SaLjw'
    //get map from mapbox
    mapboxgl.accessToken = token
    //rendering specifications for mapbox
    const mapConfig = {
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v9',
      center: this.state.centerCoordinates,
      zoom: 12
    }

    this.map = new mapboxgl.Map(mapConfig)

  }

  componentWillReceiveProps() {
    const {userHotel, getUsersHotel, user} = this.props
    if (user.id && userHotel.name === undefined && this.state.getHotel === true) {
      getUsersHotel(user.id, this.props.match.params.tripId)
      this.setState({getHotel: false})
    }

  }

  componentWillUnmount() {
    this.map.remove()
  }

  hotelSearch(e) {
    const {user, trip} = this.props
    e.preventDefault()
    axios.get('/api/hotels/possible', {
      params: {
        term: e.target.hotel.value,
        userId: user.id,
        long: trip.long,
        lat: trip.lat
      }
    })
    .then((results) => {
      this.setState({possibleHotels: results.data})
    })
  }

  flightInfo(e) {
    e.preventDefault()

    const {trip, user, getUsersOnTrip} = this.props

    axios.post('/api/memberships/flightinfo', {
      arrivalAirline: e.target.arrivalairline.value,
      arrivalFlightNum: e.target.arrivalflight.value,
      arrivalDate: e.target.arrivaldate.value,
      arrivalTime: e.target.arrivaltime.value,
      departureAirline: e.target.departureairline.value,
      departureFlightNum: e.target.departureflight.value,
      departureDate: e.target.departuredate.value,
      departureTime: e.target.departuretime.value,
      tripId: trip.id,
      userId: user.id
    })
    .then(() => {
      getUsersOnTrip(this.props.match.params.tripId)
      document.getElementById('flight-info-form').reset()
    })
  }

  selectHotel(name, add1, city, state, lat, long, url, photoUrl) {
    const {user, userSelectedHotel} = this.props

    axios.post('/api/hotels/userhotel', {
      name: name,
      add1: add1,
      city: city,
      state: state,
      lat: lat,
      long:long,
      url: url,
      photoUrl: photoUrl,
      userId: user.id,
      tripId: this.props.match.params.tripId
    })
    .then(result => {
      userSelectedHotel(result.data)

      var popup = new mapboxgl.Popup()
        .setText(name)

      var marker = new mapboxgl.Marker()
        .setLngLat([result.data.long, result.data.lat])
        .setPopup(popup)
        .addTo(this.map)

      this.map.easeTo({center: [result.data.long, result.data.lat], zoom:15})
    })
  }

  render() {
    const {trip, users, user, userHotel} = this.props
    const style = {
      position: 'relative',
      top: 0,
      bottom: 0,
      width: '100%',
      height: '550px'
    }

    if (trip.id) {
      this.map.jumpTo({center: [Number(trip.lat), Number(trip.long)]})
    }

    let userTripInfo
    if (users.length > 0) {
      userTripInfo = users.filter(result => result.userId === user.id)
      userTripInfo = userTripInfo[0]
    }

    return (
      <div className="two-rem-padding">
        <h1 className="capitalized-header">MY TRIP INFO</h1>
        <div id="hotel-option-container">
          <div id="hotel-option-sidebar">
            <h2 className="purple-sub-head">Lodging Details</h2>
            <div id="hotel-options">
              {
                userHotel.name
                  ? <div>
                    <img src={userHotel.photoUrl} className="hotel-search-image" />
                    <h4>{userHotel.name}</h4>
                    <p className="small-no-margin">{`${userHotel.add1}, ${userHotel.city}, ${userHotel.state}`}</p>
                    <button type="button" onClick={() => this.selectHotel(userHotel.name, userHotel.add1, userHotel.city, userHotel.state, userHotel.long, userHotel.lat, userHotel.url, userHotel.photoUrl)}>See Hotel on Map</button>
                  </div>
                  : <div>
                  <form onSubmit={this.hotelSearch}>
                  <label>Search for Hotel Details</label>
                  <input placeholder="Search for your hotel" id="hotel-search" name="hotel"></input>
                </form>
                {
                  this.state.possibleHotels.length > 0 &&
                    this.state.possibleHotels.map(hotel => (
                      <div key={hotel.name}>
                        <form key={hotel.name}>
                          <div className="hotel-search-result">
                            <div className="small-left-margin" style={{backgroundImage: `url(${hotel.photoUrl})`}}>
                              <a href={hotel.url} target="_blank"><h5 name="hotelName">{hotel.name}</h5></a>
                              <p className="small-no-margin">{`${hotel.add1}, ${hotel.city}, ${hotel.state}`}</p>
                            </div>
                          </div>
                          <div className="hotel-search-select">
                              <button type="button" onClick={() => this.selectHotel(hotel.name, hotel.add1, hotel.city, hotel.state, hotel.lat, hotel.long, hotel.url, hotel.photoUrl)} className="button-outline center-loading">Select This Hotel</button>
                              </div>
                        </form>
                      </div>
                    ))
                }
                </div>
              }
            </div>
            <h2 className="purple-sub-head">Flight Details</h2>
              <div id="hotel-options">
                {
                  (users.length > 0 && userTripInfo.name)
                    ? userTripInfo.flightBooked
                      ? <div>
                        <h5>Arrival Info</h5>
                        <p className="small-no-margin"><span className="bold">Airline: </span>{userTripInfo.arrivalAirline}</p>
                        <p className="small-no-margin"><span className="bold">Flight #: </span>{userTripInfo.arrivalFlightNum}</p>
                        <p className="small-no-margin"><span className="bold">Date: </span>{userTripInfo.arrivalDate}</p>
                        <p className="small-no-margin"><span className="bold">Time: </span>{userTripInfo.arrivalTime}</p>
                        <h5>Departure Info</h5>
                        <p className="small-no-margin"><span className="bold">Airline: </span>{userTripInfo.departureAirline}</p>
                        <p className="small-no-margin"><span className="bold">Flight #: </span>{userTripInfo.departureFlightNum}</p>
                        <p className="small-no-margin"><span className="bold">Date: </span>{userTripInfo.departureDate}</p>
                        <p className="small-no-margin"><span className="bold">Time: </span>{userTripInfo.departureTime}</p>
                      </div>
                      : <form onSubmit={this.flightInfo} id="flight-info-form">
                        <label>Enter Arrival Details</label>
                        <input placeholder="Airline" name="arrivalairline" />
                        <input placeholder="Flight #" name="arrivalflight" />
                        <input placeholder="Date (YYYY-MM-DD)" name="arrivaldate" />
                        <input placeholder="Arrival Time" name="arrivaltime" />
                        <label>Enter Departure Details</label>
                        <input placeholder="Airline" name="departureairline" />
                        <input placeholder="Flight #" name="departureflight" />
                        <input placeholder="Date (YYYY-MM-DD)" name="departuredate" />
                        <input placeholder="Departure Time" name="departuretime" />
                        <button className="button">Submit</button>
                      </form>
                    : <form onSubmit={this.flightInfo} id="flight-info-form">
                      <label>Enter Arrival Details</label>
                      <input placeholder="Airline" name="arrivalairline" />
                      <input placeholder="Flight #" name="arrivalflight" />
                      <input placeholder="Date (YYYY-MM-DD)" name="arrivaldate" />
                      <input placeholder="Arrival Time" name="arrivaltime" />
                      <label>Enter Departure Details</label>
                      <input placeholder="Airline" name="departureairline" />
                      <input placeholder="Flight #" name="departureflight" />
                      <input placeholder="Date (YYYY-MM-DD)" name="departuredate" />
                      <input placeholder="Departure Time" name="departuretime" />
                      <button className="button">Submit</button>
                    </form>
                }
              </div>
          </div>
          <div id="hotel-option-map">
            <div style={style} id='map' />
          </div>
        </div>
      </div>
    )
  }
}

/**
 * CONTAINER
 */

const mapState = ({user, users, trip, possibleHotels, userHotel}, ownProps) => {
  return {
    user,
    users,
    trip,
    possibleHotels,
    userHotel
  }
}

const mapDispatch = (dispatch) => {
  return {
    getTripInfo(tripId){
      dispatch(fetchTripInfo(tripId))
    },
    getPossibleHotels(tripId){
      dispatch(getHotels(tripId))
    },
    getUsersOnTrip(tripId){
      dispatch(fetchUsersOnTrip(tripId))
    },
    userSelectedHotel(hotel){
      dispatch(setUserHotel(hotel))
    },
    getUsersHotel(userId, tripId){
      dispatch(fetchUserHotel(userId, tripId))
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(Hotels))
