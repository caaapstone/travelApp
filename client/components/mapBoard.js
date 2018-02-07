import React, { Component } from 'react';
import { connect } from 'react-redux';
import { subscribeToTripThunkCreator, unsubscribeToTripThunkCreator, fetchTrip, setMapActionCreator } from '../store'
import reactMapboxGL, {Layer, Feature, GeoJSONLayer, Popup} from 'react-mapbox-gl'
import mapboxgl from 'mapbox-gl'
import firebase from '../firebase'
import {withRouter} from 'react-router-dom'
import axios from 'axios'
import Gravatar from 'react-gravatar'
import ReactTooltip from 'react-tooltip'

const times = ['breakfast',
  'morning',
  'lunch',
  'afternoon',
  'dinner',
  'evening'
]

if (process.env.NODE_ENV !== 'production') require('../../secrets')
console.log('process.env', process.env.NODE_ENV)


let token = process.env.MAPBOX

class MapBoard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activities: {},
      currentDay: '',
      directions: [],
      colors: ['#56aee2', '#5568e2', '#8a55e2', '#cf56e2', '#e256ae', '#e25668', '#e28956', '#e2d055', '#aee255', '#68e256', '#56e289'],
      lineStyle: '',
      open: false,
      selectedActivity: {}
    }

    this.handleButtonClick = this.handleButtonClick.bind(this)
    // this.handlePopupClick = this.handlePopupClick.bind(this)
    this.dateRange = this.dateRange.bind(this)
    this.onOpenModal = this.onOpenModal.bind(this)
    this.onCloseModal = this.onCloseModal.bind(this)
  }

  componentWillMount(){
    let tripId = this.props.match.params.tripId
    this.props.subscribeToFirebase(this, tripId)
    this.Map = reactMapboxGL({accessToken: token})
  }

  componentWillUnmount(){
    let tripId = this.props.match.params.tripId
    this.props.unsubscribeFromFirebase(this, tripId)
  }

  componentDidMount(){
    //if there are no activities when this mounts, we need to get the activities
    let activities = this.props.activities.filter(activity => {
      return activity.isActive && activity.date.length > 0
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
      this.setState({activities: dates})
    })

  }
  dateRange(day) {
    let splitDate = day.split('-')
    let newDate = [splitDate[1], splitDate[2], splitDate[0]]
    return newDate.join('/')
   }

  handleButtonClick(e) {
    let selectedDay = e.target.value
    let style = e.target.style.backgroundColor
    let coordinates = this.state.activities[selectedDay].coordinates.join(';')
    this.setState({currentDay: selectedDay, directions: [], lineStyle: style})
    if (this.state.activities[selectedDay].coordinates.length > 1){
    axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&overview=full&annotations=distance&steps=true&access_token=pk.eyJ1IjoiYW1iaWwiLCJhIjoiY2pkMHNvaXp2MzhhdTJ4cngzMzk5dTJyMSJ9.BGoNBLsg0yW4Sswk3SaLjw`)
      .then(res => {
        this.setState({directions: res.data.routes[0].geometry.coordinates})
      })
      .catch(err => console.error(err))
    }
  }

  onOpenModal(){
    this.setState({ ...this.state, open: true });
  }

  onCloseModal(){
    this.setState({ ...this.state, open: false });
  }

  render() {
    let counter = 0
    let currentColor
    let days = Object.keys(this.state.activities)
    days = days.sort()
    let currentDay = this.state.currentDay
    let colors = this.state.colors
    return (
      <div className="whole-map-container">
        <div className="button-container">
          {
            days.map(day => {
              currentColor = colors[counter++ % colors.length]
              return (
                <button style={{backgroundColor: currentColor}} className="map-button" value={day} onClick={this.handleButtonClick}>{this.dateRange(day)}</button>
              )
            })
          }
        </div>
      <div className="actual-map">
      <this.Map
      style="mapbox://styles/mapbox/streets-v9"
      zoom={[5]}
      center={currentDay ? this.state.activities[currentDay].coordinates[0] : [-98.35, 39.50]
      }
      containerStyle={{
        height: '100vh',
        width: '100vw',
        textAlign: 'left',
        position: 'fixed'
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
                            value={singleDayActivity.name}
                            coordinates={[singleDayActivity.long, singleDayActivity.lat]}
                            offset={{
                              'bottom-left': [12, -38], 'bottom': [0, -38], 'bottom-right': [-12, -38]
                            }}
                            onClick={this.onOpenModal}
                            >
                            <div>
                            <em>{singleDayActivity.time}</em>
                            <br />
                            <b>{singleDayActivity.name}</b>
                            <ReactTooltip />
                            <br />
                            Last updated by: <a data-tip={singleDayActivity.userUpdated}>
                              <Gravatar className="gravatar" email={singleDayActivity.userUpdated} size={12} />
                            </a>
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
          { this.state.directions.length &&
            <Layer
              type="line"
              layout={{ "line-cap": "round", "line-join": "round" }}
              paint={{ "line-color": this.state.lineStyle, "line-width": 4 }}>
              <Feature coordinates={this.state.directions} />
            </Layer>
          }
      </this.Map>
      </div>
      </div>
    )
  }
}

let mapStateToProps = state => {
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
    }
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MapBoard))
