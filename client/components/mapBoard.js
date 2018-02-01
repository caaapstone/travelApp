import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getRoutes, subscribeToTripThunkCreator, unsubscribeToTripThunkCreator, fetchTrip } from '../store'
import mapboxgl from 'mapbox-gl'
import firebase from '../firebase'

const times = {
  breakfast: 0,
  morning: 1,
  lunch: 2,
  afternoon: 3,
  dinner: 4,
  evening: 5
}

let token = 'pk.eyJ1IjoiYW1iaWwiLCJhIjoiY2pkMHNvaXp2MzhhdTJ4cngzMzk5dTJyMSJ9.BGoNBLsg0yW4Sswk3SaLjw'

class MapBoard extends Component {
  constructor() {
    super()
    this.state = {
      style: {
        positon: 'absolute',
        width: '200vh',
        height: '100vh'
      }
    }
  }

  componentWillMount(){
    let tripId = this.props.match.params.tripId
    this.props.subscribeToFirebase(this, tripId)
  }

  componentWillUnmount(){
    let tripId = this.props.match.params.tripId
    this.props.unsubscribeFromFirebase(this, tripId)
    this.map.remove();
  }

  componentDidMount(){
    //get map from mapbox
    mapboxgl.accessToken = token;
    //rendering specifications for mapbox
    const mapConfig = {
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [-87.6354, 41.8885],
      zoom: 5
    };

    this.map = new mapboxgl.Map(mapConfig);

    this.map.on('load', () => {
      let activities = this.props.activities

      let timesArr = activities.map(activity => {
        return activity.time
      })

      timesArr = timesArr.sort(function(a, b){
        if (times[a] < times[b]){
          return -1
        }

        if (times[a] > times[b]){
          return 1
        }

        if (times[a] === times[b]){
          return 0
        }
      })

      // Get the map style and set it in the state tree
      this.map.addSource('routes', {
        type: 'geojson',
        // data: {getRoutes: this.props.getRoutes(coordinates)}
        //The data needs to be from the getRoutes thunk; this.props.getRoutes(coordinates) ??
      });
      this.map.addLayer({
        id: 'routes',
        type: 'line',
        source: 'routes'
      })
      this.map.addSource('points', {
        type: 'geojson'
      })
      this.map.addLayer({
        id: 'points',
        type: 'symbol',
        source: 'routes'
      })
    })
  }

  render() {
    return (
      <div>
        <h1>Map</h1>
        <div style={this.state.style} id='map' />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    activities: state.activities
  };
}

let mapDispatchToProps = dispatch => {
  return {
    subscribeToFirebase(component, tripId){
      dispatch(subscribeToTripThunkCreator(component, tripId))
    },
    unsubscribeFromFirebase(component, tripId){
      dispatch(unsubscribeToTripThunkCreator(component, tripId))
    },
    getTripInfo(tripId){
      dispatch(fetchTrip(tripId))
    },
    getRoutes(coordinates){
      console.log(coordinates)
      dispatch(getRoutes(coordinates))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MapBoard)
