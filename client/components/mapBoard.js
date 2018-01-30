import React, {Component} from 'react'
import {connect} from 'react-redux'
import mapbox, {Layer, Feature, Popup, GeoJSONLayer} from 'react-mapbox-gl'
import { getRoutes } from '../store'
import { Marker } from 'mapbox-gl/dist/mapbox-gl';
import firebase from '../firebase'

//make an endpoint on server that hits the mapbox coord and responds with the route data
//must be in longitude, latitude coordinate order. Long is a negative num
//frontend => axios.get => mapbox
//polyline coordinates

let activities = [{
  name: 'Alinea',
  lat: 41.8885,
  long: -87.6354,
  date: '2017-2-14',
  tripId: 1,
  isActive: true,
  time: 'dinner',
  users: [1, 2],
  link: 'http://www.ozarlington.com/wp-content/uploads/2017/04/bar-buffet.jpg'
},
{
  name: 'Hampton Social',
  lat: 41.8898,
  long: -87.6377,
  date: '2017-2-14',
  tripId: 1,
  isActive: true,
  time: 'lunch',
  users: [1],
  link: 'http://www.ozarlington.com/wp-content/uploads/2017/04/bar-buffet.jpg'
},
{
  name: 'Millenium Park',
  lat: 41.882702,
  long: -87.619392,
  date: '2017-2-14',
  tripId: 1,
  isActive: true,
  time: 'morning',
  users: [1],
  link: 'http://www.ozarlington.com/wp-content/uploads/2017/04/bar-buffet.jpg'
},
{
  name: 'Art Institute',
  lat: 41.8796,
  long: -87.6237,
  date: '2017-2-14',
  tripId: 1,
  isActive: true,
  time: 'afternoon',
  users: [1, 4],
  link: 'http://www.ozarlington.com/wp-content/uploads/2017/04/bar-buffet.jpg'
},
{
  name: 'Science & Industry',
  lat: 41.7906,
  long: -87.5831,
  date: '2017-2-15',
  tripId: 1,
  time: 'evening',
  isActive: true,
  users: [3, 4],
  link: 'http://www.ozarlington.com/wp-content/uploads/2017/04/bar-buffet.jpg'
},
{
  name: 'Sky Deck',
  lat: 41.8787,
  long: -87.6359,
  date: '2017-2-15',
  tripId: 1,
  isActive: true,
  time: 'breakfast',
  users: [1],
  link: 'http://www.ozarlington.com/wp-content/uploads/2017/04/bar-buffet.jpg'
}]


const Map = mapbox({accessToken: 'pk.eyJ1IjoiYW1iaWwiLCJhIjoiY2pkMHNvaXp2MzhhdTJ4cngzMzk5dTJyMSJ9.BGoNBLsg0yW4Sswk3SaLjw'})

  //these will format the coords the right way for the api request
  let coordsArr = activities.map(activity => {
    return [activity.long, activity.lat]
  })

  let coords = coordsArr.join(';')

  console.log('coords', coords)
  //This and above


const MapBoard = props => {
  return (
    <Map
      zoom={[5]}
      center={[-87.6359, 41.8787]}
      style="mapbox://styles/mapbox/streets-v9"
      containerStyle={{
        height: "75vh",
        width: "75vw"
      }}>
      <Layer
        type="line"
        id="marker"
        layout={{ "line-join": "bevel" }}>
        <Feature coordinates={coords}/>
      </Layer>
      <GeoJSONLayer
        data={{
          type: "FeatureCollection",
          features: [{
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [coordsArr]
              ]
            }
          }]
        }} />
    </Map>
  )
}

//I'm thinking in the GeoJSON layer that there needs to be props that come from a dispatch call

let mapDispatch = dispatch => {
  // pass getRoutes the coordinates and date
  // return {
  //   getRoutes: dispatch(getRoutes(coords))
  // }
}

export default connect(mapDispatch)(MapBoard)
