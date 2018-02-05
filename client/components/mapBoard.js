import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getRoutes, subscribeToTripThunkCreator, unsubscribeToTripThunkCreator, fetchTrip, setMapActionCreator } from '../store'
import reactMapboxGL, {Layer, Feature, GeoJSONLayer, Popup} from 'react-mapbox-gl'
import mapboxgl from 'mapbox-gl'
import firebase from '../firebase'
import {withRouter} from 'react-router-dom'

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
    "type": "FeatureCollection",
    "features": []
  }

  if (routes.length > 0) {
    routesGeoJSON.features.push({
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "properties": {},
        "coordinates": [routes] //put coordinates in there
      }
    })
  }

  routes.forEach(route => {
    routesGeoJSON.features.push({
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "properties": {},
        "coordinates": [routes]
      }
    })
  })

  return routesGeoJSON
}


class MapBoard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activities: {},
      currentDay: '',
      routesGeoJSON: {},
      style: {
        fillColor:'#f03'
      }
    }

    this.handleButtonClick = this.handleButtonClick.bind(this)
    this.handlePopupClick = this.handlePopupClick.bind(this)
  }

  componentWillMount(){
    let tripId = this.props.match.params.tripId
    this.props.subscribeToFirebase(this, tripId)
  }

  componentWillUnmount(){
    let tripId = this.props.match.params.tripId
    this.props.unsubscribeFromFirebase(this, tripId)
  }

  componentDidMount(){
    //if there are no activities when this mounts, we need to get the activities
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
      this.setState({activities: dates})
    })
  }

  handleButtonClick(e) {
    let selectedDay = e.target.value
    this.setState({currentDay: selectedDay})
  }

  handlePopupClick(e){
    console.log('this is the popup event: ', e)
  }

  render() {
    let marker = new mapboxgl.Marker()
    const Map = reactMapboxGL({accessToken: token})
    let days = Object.keys(this.state.activities)
    days = days.sort()
    let currentDay = this.state.currentDay
    console.log('currentDay', currentDay)
    return (
      <div>
        <div>
          {
            days.map(day => {
              return (
                <button className="button" value={day} onClick={this.handleButtonClick}>{day}</button>
              )
            })
          }
        </div>
      <Map
      className="map-container"
      style="mapbox://styles/mapbox/streets-v9"
      center={[-87.6354, 41.8885]}
      containerStyle={{
        height: "90vh",
        width: "90vw"
      }}>

          {
            days.map(day => {
              let singleDayActivities
              if (currentDay === day){
                let activeTimes = times.filter(time => !!this.state.activities[currentDay][time])
                let filteredDay = this.state.activities[day]
                return (
                activeTimes.map(activeTime => {
                  singleDayActivities = filteredDay[activeTime]
                  return (
                    singleDayActivities.map(singleDayActivity => {
                      return (
                        <div>
                          <Layer
                           >
                            <Feature
                            type="symbol"
                            id="marker"
                            layout={{ "icon-image": "marker-15" }}
                            coordinates={[singleDayActivity.long, singleDayActivity.lat]}/>
                          </Layer>
                          <Popup
                            coordinates={[singleDayActivity.long, singleDayActivity.lat]}
                            offset={{
                              'bottom-left': [12, -38], 'bottom': [0, -38], 'bottom-right': [-12, -38]
                            }}
                            onClick={this.handlePopupClick}
                            >
                            <div>
                            <img className="popup-thumbnail" src={singleDayActivity.imageUrl}/>
                            </div>
                          </Popup>
                        </div>
                      )
                    })
                  )
                })
                )
              }
            })
          }
      </Map>
      </div>
    )
  }
}

let mapStateToProps = state => {
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
      dispatch(getRoutes(coordinates, numRoutes))
    },
    setMapActionCreator(map) {
      dispatch(setMapActionCreator(map))
    }
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MapBoard))



