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
    this.props.subscribeToFirebase(this, tripId)
    this.props.getCurrentTripMembership(tripId)
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
    let days = Object.keys(this.state.activities)
    days = days.sort()
    return (
      <div className="itinerary-page">
      <h1>Itinerary</h1>
      <h2>Activities Schedule</h2>
      {
        days.map(day => {
          let schedTimes = times.filter(time => !!this.state.activities[day][time])
          let singleDayAllActivities = this.state.activities[day]
          return (
          schedTimes.map(schedTime => {
            let singleSchedActivity = singleDayAllActivities[schedTime]
            return (
              singleSchedActivity.map(activity => {
                console.log('activity', activity)
                let location = activity.yelpInfo.location
                let phone = activity.yelpInfo.phone
                {/* console.log('activity', activity) */}
                return (
                  <div>
                    <h3>Date: {activity.date}</h3>
                    <h3>{schedTime}</h3>
                    <p>{activity.name}</p>
                    <p>Phone Number: {phone}</p>
                    <p>{location.address1}</p>
                    <p>{location.city}, {location.state} {location.zip_code}</p>
                  </div>
                )
              })
            )
          })
        )})
      }
      </div>
    )
  }
}

let mapStateToProps = state => {
  return {
    activities: state.activities
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
