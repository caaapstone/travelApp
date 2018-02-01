import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import axios from 'axios'
import mapboxgl from 'mapbox-gl'
import {hotelSearch, fetchTripInfo, getHotels} from '../store'

/**
 * COMPONENT
 */

class Hotels extends Component {
  constructor(props) {
    super(props)

    this.state = {
      centerCoordinates: [-87.6354, 41.8885]
    }
    this.hotelMarker = this.hotelMarker.bind(this)
  }

  componentDidMount() {
    const {trip, getTripInfo} = this.props

    if (!trip.id) {
      getTripInfo(this.props.match.params.tripId)
    }

    let token = 'pk.eyJ1IjoiYW1iaWwiLCJhIjoiY2pkMHNvaXp2MzhhdTJ4cngzMzk5dTJyMSJ9.BGoNBLsg0yW4Sswk3SaLjw'
    //get map from mapbox
    mapboxgl.accessToken = token
    //rendering specifications for mapbox
    const mapConfig = {
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v9',
      center: this.state.centerCoordinates,
      zoom: 10
    }

    this.map = new mapboxgl.Map(mapConfig)

  }

  componentDidUpdate() {
    const {trip, getPossibleHotels, setPossibleHotels, possibleHotels} = this.props
    if (trip.id && !possibleHotels.length) {
      axios.get('/api/hotels', {
        params: {
          tripId: this.props.match.params.tripId
        }
      })
      .then(results => {
        if(!results.data.length) {
          setPossibleHotels(trip.long, trip.lat, this.props.match.params.tripId)
        } else {
          getPossibleHotels(this.props.match.params.tripId)
        }
      })
    }
  }

  componentWillUnmount() {
    this.map.remove()
  }

  hotelMarker(e) {
    console.log('hi!')
    console.log(e.target.value)
  }

  render() {
    const {trip, possibleHotels} = this.props
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

    return (
      <div>
        <h1 className="capitalized-header">Hotels</h1>
        <div id="hotel-option-container">
          <div id="hotel-option-sidebar">
            <button id="add-own-hotel">Enter A Hotel</button>
            <div id="hotel-options">
              {
                possibleHotels.length && possibleHotels.map(hotel => (
                  <div key={hotel.id} className="hotel-option-list-item" onClick={this.hotelMarker}>
                    <div name="location" value={`${hotel.lat}-${hotel.long}`}>
                      <h4>{hotel.name}</h4>
                      <p>{`${hotel.add1}, ${hotel.city}, ${hotel.state}`}</p>
                    </div>
                  </div>
                ))
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

const mapState = ({trip, possibleHotels}, ownProps) => {
  return {
    trip,
    possibleHotels
  }
}

const mapDispatch = (dispatch) => {
  return {
    getTripInfo(tripId){
      dispatch(fetchTripInfo(tripId))
    },
    setPossibleHotels(lat, long, tripId){
      dispatch(hotelSearch(lat, long, tripId))
    },
    getPossibleHotels(tripId){
      dispatch(getHotels(tripId))
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(Hotels))
