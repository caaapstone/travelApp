import React, {Component} from 'react'
import { subscribeToTripThunkCreator, unsubscribeToTripThunkCreator, getMembership, updateActivity } from '../store';
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'

//Itinerary should have flight info
//lodging info if available
//destination info
//activity info broken up by date/time
const times = ['breakfast',
  'morning',
  'lunch',
  'afternoon',
  'dinner',
  'evening'
]

class Itinerary extends Component {
  constructor(props){
    super(props)
    this.state = {
      activities: {}
    }
  }

  componentWillMount(){
    let tripId = this.props.match.params.tripId
    this.props.getCurrentTripMembership(tripId)
    this.props.subscribeToFirebase(this, tripId)
  }

  componentWillUnmount(){
    let tripId = this.props.match.params.tripId
    this.props.unsubscribeFromFirebase(this, tripId)
  }

  componentDidMount(){
    //if there are no activities when this mounts, we need to get the activities
    // if(!this.props.activities.length) //dispatch something that will get the activities
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

    let days = Object.keys(dates);

    days.forEach(day => {
      if (!dates.hasOwnProperty(day)) return;
      times.filter(time => {
        //this is where it sorts by time of day
        return !!dates[day][time]})
      .map(time =>
        //this is concatenating the long lat and breaking them into arrays of 2 the join/split madness is coercing the value from str to num
        dates[day][time].map(({ lat, long }) => ([+long, +lat])
        ).join(';')
      ).join(';')
      .split(';')
      this.setState({activities: dates})
    })

  }

  render(){
    console.log("this.props", this.props)
    if (!this.props.activities.length) {return <div />} else {
    let days = Object.keys(this.state.activities)
    days = days.sort()
    return (
      <div className="itinerary-page">
      <h1>Itinerary</h1>
      <h2>Hypothetical Users Section</h2>
      <div className="user-itinerary-info-section">
        <div className="user-itinerary-info">
          <h3>User Name 1</h3>
          <p>Flight Info</p>
          <p>Hotel Info</p>
        </div>
        <div className="user-itinerary-info">
          <h3>User Name 2</h3>
          <p>Flight Info</p>
          <p>Hotel Info</p>
        </div>
        <div className="user-itinerary-info">
          <h3>User Name 3</h3>
          <p>Flight Info</p>
          <p>Hotel Info</p>
        </div>
        <div className="user-itinerary-info">
          <h3>User Name 3</h3>
          <p>Flight Info</p>
          <p>Hotel Info</p>
        </div>
      </div>
      <h1 className="city-title"><span>{this.props.trip.destinationCity}, {this.props.trip.destinationState}</span></h1>
      <h2>Activities Schedule</h2>
      {
        days.map(day => {
          let schedTimes = times.filter(time => !!this.state.activities[day][time])
          let singleDayAllActivities = this.state.activities[day]
          return (
            <div key={day} className="itinerary-activities">
              <div className="itinerary-date">
                <h3>{day}</h3>
              </div>
              <div className="activity-info-group">
            {
              schedTimes.map(schedTime => {
              let singleSchedActivity = singleDayAllActivities[schedTime]
              return (
                      <div className="activity-by-time">
                      <h3 key={schedTime}>{schedTime}</h3>
{                singleSchedActivity.map(activity => {
                  let location = activity.yelpInfo.location
                  let phone = activity.yelpInfo.phone
                  return (
                      <div className="individual-activity">
                        <h4 key={activity.name}>{activity.name}</h4>
                        <p key={phone}>Phone Number: {phone}</p>
                        <p key={location.address1}>{location.address1}</p>
                        <p key={location.zip_code}>{location.city}, {location.state} {location.zip_code}</p>
                      </div>
                      )
                  })}
                      </div>
                )
            })
          }
              </div>
            </div>
          )})
      }
      </div>
    )
  }
}
}

let mapStateToProps = state => {
  return {
    activities: state.activities,
    trip: state.trip
  }
}

let mapDispatchToProps = dispatch => {
  return {
    subscribeToFirebase(component, tripId){
      dispatch(subscribeToTripThunkCreator(component, tripId))
    },
    unsubscribeFromFirebase(component, tripId){
      dispatch(unsubscribeToTripThunkCreator(component, tripId))
    },
    updateActivity(activityObj){
      updateActivity(activityObj)
    },
    getCurrentTripMembership(tripId){
      dispatch(getMembership(tripId))
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Itinerary))
