import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getRoutes } from '../store'
import mapboxgl from 'mapbox-gl'
import firebase from '../firebase'

let token = 'pk.eyJ1IjoiYW1iaWwiLCJhIjoiY2pkMHNvaXp2MzhhdTJ4cngzMzk5dTJyMSJ9.BGoNBLsg0yW4Sswk3SaLjw'
class MapBoard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activities: [],
      style: {
        positon: 'absolute',
        width: '200vh',
        height: '100vh'
      }
    }
  }

  componentDidMount(){
    //get activities data from firebase
    const tripRef = firebase.database().ref(`/trips/T1`)

    tripRef.on('value', (snapshot) => {
      let tripActivities = snapshot.val();
      console.log(tripActivities)
        this.setState({...this.state, activities: tripActivities})
      }
    )
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
      // Get the map style and set it in the state tree
      this.map.addSource('routes', {
        type: 'geojson',
        data: {getRoutes: this.props.getRoutes(coordinates)}
        //The data needs to be from the getRoutes thunk; this.props.getRoutes(coordinates) ??
      });
      this.map.addLayer({
        id: 'routes',
        type: 'line',
        source: 'routes'
      })
    })
  }

  componentWillUnmount(){
    this.map.remove();
  }

  render() {
    console.log('activities', this.state.activities)
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
    coordinates: state.coordinates
  };
}

let mapDispatchToProps = dispatch => {
  return {
    // getRoutes: dispatch(getRoutes(coordinates))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MapBoard)
