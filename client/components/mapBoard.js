import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getRoutes, subscribeToTripThunkCreator, unsubscribeToTripThunkCreator, fetchTrip } from '../store'
import mapboxgl from 'mapbox-gl'
import firebase from '../firebase'

const times = ['breakfast',
  'morning',
  'lunch',
  'afternoon',
  'dinner',
  'evening'
]

let token = 'pk.eyJ1IjoiYW1iaWwiLCJhIjoiY2pkMHNvaXp2MzhhdTJ4cngzMzk5dTJyMSJ9.BGoNBLsg0yW4Sswk3SaLjw'

let getRoutesGeoJSON = (coordinates) => {
  const routesGeoJSON = {
    type: 'Feature',
    features: []
  }

  routesGeoJSON.features.push({
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [coordinates]
    },
    layout: {
      lineJoin: 'round',
      lineCap: 'round'
    },
    paint: {
      lineColor: '#888',
      lineWidth: 8
    }
  })

  console.log('routes', routes)
}


class MapBoard extends Component {
  constructor() {
    super()
    this.state = {
      style: {
        positon: 'absolute',
        width: '200vh',
        height: '100vh'
      },
      routesGeoJSON: {
        type: 'Feature',
        features: []
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
      let activities = this.props.activities.filter(activity => {
        return activity.isActive
      })
      //dates object stores dates from the activities arr as keys
      let dates = {}
      //create an arr of activity obj as keys on dates obj
      activities.forEach(activity => {
        if (!dates[activity.date]) {
          dates[activity.date] = {};
        }
        if (!dates[activity.date][activity.time]) {
          dates[activity.date][activity.time] = [activity];
        } else {
          dates[activity.date][activity.time].push(activity);
        }
      })

      const days = Object.keys(dates);

      days.forEach(day => {
        if (!dates.hasOwnProperty(day)) return;
        dates[day].coordinates = times.filter(time => !!dates[day][time])
        .map(time =>
          dates[day][time].map(({ lat, long }) =>
            `${long},${lat}`
          ).join(';')
        ).join(';');
      });
      //this is passing the coords through the getRoutes thunk

      days.forEach(day => {
        let numRoutes = dates[day].coordinates.split(';').length
        // console.log('numRoutes compDidMount', numRoutes)
        let coordinates = dates[day].coordinates
        // this.props.getRoutes(coordinates, numRoutes)
      })

      this.map.addSource('routes', {
        type: 'geojson',
        // data: {}
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
    getRoutes(coordinates, numRoutes){
      console.log(coordinates)
      dispatch(getRoutes(coordinates, numRoutes))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MapBoard)
