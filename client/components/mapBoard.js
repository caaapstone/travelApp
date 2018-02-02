import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getRoutes, subscribeToTripThunkCreator, unsubscribeToTripThunkCreator, fetchTrip, setMapActionCreator } from '../store'
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

let getRoutesGeoJSON = (activities, routes) => {
  const routesGeoJSON = {
    type: 'FeatureCollection',
    features: []
  }

  if (routes.length > 0) {
    routesGeoJSON.features.push({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [routes] //put coordinates in there
      }
    })
  }

  routes.forEach(route => {
    routesGeoJSON.features.push({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [routes]
      }
    })
  })

  return routesGeoJSON
}


class MapBoard extends Component {
  constructor() {
    super()
    this.state = {
      activities: {},
      style: {
        positon: 'absolute',
        width: '200vh',
        height: '100vh'
      },
      routesGeoJSON: {
        type: 'FeatureCollection',
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
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [-87.6354, 41.8885],
      zoom: 5
    };

    this.map = new mapboxgl.Map(mapConfig);
    console.log('map', this.map)
    this.props.setMapActionCreator(this.map)

    this.map.on('load', () => {
      //dates object stores dates from the activities arr as keys

      let activities = this.props.activities.filter(activity => {
        return activity.isActive
      })

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
        dates[day].coordinates = times.filter(time => {
          //this is where it sorts by time of day
          return !!dates[day][time]})
        .map(time =>
          //this is concatenating the long lat and breaking them into arrays of 2 the join/split madness is coercing the value from str to num
          dates[day][time].map(({ lat, long }) => ([+long, +lat])
          ).join(';')
        ).join(';')
        .split(';')
      })


      days.forEach(day => {
        dates[day].coordinates = dates[day].coordinates.map(coordinate => {
          coordinate = coordinate.split(',').map(item => +item)
          return coordinate
        })
        let routes = dates[day].coordinates
        // this.props.getRoutes(routes)
        this.setState({routesGeoJSON: getRoutesGeoJSON(activities, routes)})
      })

      this.map.addSource('routes', {
        type: 'geojson',
        data: this.state.routesGeoJSON
      });

      this.map.addLayer({
        id: 'route',
        type: 'line',
        source: 'routes',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#888',
          'line-width': 8
        }
      })
    })
  }

  render() {
    //somehow you need to get the source
    return (
      <div>
        <h1>Map</h1>
        <div style={this.state.style} ref={el => (this.mapContainer = el)} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    activities: state.activities,
    routes: state.routes
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
    },
    setMapActionCreator(map) {
      dispatch(setMapActionCreator(map))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MapBoard)
