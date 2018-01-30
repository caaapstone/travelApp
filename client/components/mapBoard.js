import React, {Component} from 'react'
import {connect} from 'react-redux'
import mapbox, {Layer, Feature, Popup, GeoJSONLayer} from 'react-mapbox-gl';
import { Marker } from 'mapbox-gl/dist/mapbox-gl';

//make an endpoint on server that hits the mapbox coord and responds with the route data
//must be in longitude, latitude coordinate order. Long is a negative num
//frontend => axios.get => mapbox
//polyline coordinates

const Map = mapbox({accessToken: 'pk.eyJ1IjoiYW1iaWwiLCJhIjoiY2phOXN3Mng5MGE1OTJxcGV3d2E5bG80OCJ9.0FLVhhyTbMKWTeRtZGOSGA'})

const mockActivities = [{
  name: 'Alinea',
  lat: 41.8885,
  long: -87.6354,
  date: '2017-2-14',
  tripId: 1,
  isActive: true,
  time: 'evening',
  link: 'http://www.ozarlington.com/wp-content/uploads/2017/04/bar-buffet.jpg'
},
{
  name: 'Hampton Social',
  lat: 41.8898,
  long: -87.6377,
  date: '2017-2-14',
  tripId: 1,
  isActive: true,
  time: 'morning',
  link: 'http://www.ozarlington.com/wp-content/uploads/2017/04/bar-buffet.jpg'
},
{
  name: 'Millenium Park',
  lat: 41.882702,
  long: -87.619392,
  date: '2017-2-14',
  tripId: 1,
  isActive: true,
  time: 'afternoon',
  link: 'http://www.ozarlington.com/wp-content/uploads/2017/04/bar-buffet.jpg'
},
{
  name: 'Art Institute',
  lat: 41.8796,
  long: -87.6237,
  date: '2017-2-14',
  tripId: 1,
  isActive: true,
  time: 'morning',
  link: 'http://www.ozarlington.com/wp-content/uploads/2017/04/bar-buffet.jpg'
},
{
  name: 'Science & Industry',
  lat: 41.7906,
  long: -87.5831,
  date: '2017-2-15',
  tripId: 1,
  isActive: true,
  link: 'http://www.ozarlington.com/wp-content/uploads/2017/04/bar-buffet.jpg'
},
{
  name: 'Sky Deck',
  lat: 41.8787,
  long: -87.6359,
  date: '2017-2-15',
  tripId: 1,
  isActive: true,
  time: 'afternoon',
  link: 'http://www.ozarlington.com/wp-content/uploads/2017/04/bar-buffet.jpg'
},
{
  name: 'Sky Deck',
  lat: 41.8787,
  long: -87.6359,
  date: '2017-2-15',
  tripId: 1,
  isActive: true,
  time: 'morning',
  link: 'http://www.ozarlington.com/wp-content/uploads/2017/04/bar-buffet.jpg'
}]

const

const MapBoard = props => {
  return (
    <Map
    style= {"mapbox://styles/mapbox/streets-v9"}
    >
    </Map>
  )
}
//I'm thinking in the GeoJSON layer that there needs to be props that come from a dispatch call

export default MapBoard
