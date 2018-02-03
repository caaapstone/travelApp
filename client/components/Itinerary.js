import React, {Component} from 'react'
import { subscribeToTripThunkCreator, unsubscribeToTripThunkCreator, fetchTrip, updateActivity } from '../store';
import {connect} from 'react-redux'

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

    return (
      <div>
      <h1>Itinerary</h1>
      {
        days.map(day => {
          let splitDate = day.split('-')
          let singleDate = splitDate.pop()
          console.log('singleDate', Number(singleDate))
          let schedTimes = Object.keys(this.state.activities[day])
          console.log('day', day)
          return (
          schedTimes.map(schedTime => {
            let activity = this.state.activities[day][schedTime]
            return (
              activity.map(singleActivity => {
                return (
                  <div>
                    <h2>{day}</h2>
                    <h3>{schedTime}</h3>
                    <p>{singleActivity.name}</p>
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
    getTripInfo(tripId){
      dispatch(fetchTrip(tripId))
    },
    updateActivity(activityObj){
      updateActivity(activityObj)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Itinerary)
