import React, {Component} from 'react'
import { subscribeToTripThunkCreator, unsubscribeToTripThunkCreator, getMembership, updateActivity } from '../store';
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import { Parallax, Background } from 'react-parallax';
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

  createDate = date => {
    let myDate = new Date(date)
    myDate.setDate(myDate.getDate() + 1)
    myDate = myDate.toDateString()
    let weekday = myDate.slice(0,3)
    let month = myDate.slice(4,7)
    let day = myDate.slice(8,10) + ", "
    let year = myDate.slice(11)

    //weekday
    if (weekday == 'Sat') {
      weekday = 'Saturday,'
    }
    if (weekday == 'Sun') {
      weekday = 'Sunday,'
    }
    if (weekday == 'Mon') {
      weekday = 'Monday,'
    }
    if (weekday == 'Tue') {
      weekday = 'Tuesday,'
    }
    if (weekday == 'Wed') {
      weekday = 'Wednesday,'
    }
    if (weekday == 'Thu') {
      weekday = 'Thursday,'
    }
    if (weekday == 'Fri') {
      weekday = 'Friday,'
    }

    //month
    if (month == 'Jan') {
      month = 'January'
    }
    if (month == 'Feb') {
      month = 'February'
    }
    if (month == 'Mar') {
      month = 'March'
    }
    if (month == 'Apr') {
      month = 'April'
    }
    if (month == 'May') {
      month = 'May'
    }
    if (month == 'Jun') {
      month = 'June'
    }
    if (month == 'Jul') {
      month = 'July'
    }
    if (month == 'Aug') {
      month = 'August'
    }
    if (month == 'Sep') {
      month = 'September'
    }
    if (month == 'Oct') {
      month = 'October'
    }
    if (month == 'Nov') {
      month = 'November'
    }
    if (month == 'Dec') {
      month = 'December'
    }
    let fullDate = weekday + ' ' + month + ' ' + day + year
    return fullDate
  }

  render(){
    const bgImage = 'https://images.unsplash.com/photo-1508669232496-137b159c1cdb?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=5e05e923eadbc20a00da3a1a441dd3e3&auto=format&fit=crop&w=934&q=80'
    let days = Object.keys(this.state.activities)
    days = days.sort()
    let {membership} = this.props
    if (!membership.length) return <div />
    return (
      <Parallax
        bgImage={bgImage}
        bgImageAlt="plane"
        strength={300}
        bgStyle ={{width: '100%', opacity: .7}}
      >
      <div className="itinerary-page">
      <h1>Itinerary</h1>
      <h2>Friends on Trip</h2>
      <div className="user-itinerary-info-section">
      {
        membership.map(person =>{
          return(
            <div className="user-itinerary-info">
              <h3>{person.user.firstName} {person.user.lastName}</h3>
              <p>{person.arrivalAirline} | {person.arrivalFlightNum} | {person.arrivalDate} | {person.arrivalTime}</p>
              <p>{person.departureAirline} | {person.departureFlightNum} | {person.departureDate} | {person.departureTime}</p>
            </div>
                 )
      })
      }
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
                <h3>{this.createDate(day)}</h3>
              </div>
              <div className="activity-info-group">
            {
              schedTimes.map(schedTime => {
              let singleSchedActivity = singleDayAllActivities[schedTime]
              return (
                      <div className="activity-by-time">
                      <h3>{schedTime}</h3>
{                singleSchedActivity.map(activity => {
                  let location = activity.yelpInfo.location
                  let phone = activity.yelpInfo.phone
                  return (
                      <div className="individual-activity">
                        <div className="individual-activity-div">
                        <h4 key={activity.name}>{activity.name}</h4>
                        <p key={phone}>Phone Number: {phone}</p>
                        <p key={location.address1}>{location.address1}</p>
                        <p key={location.zip_code}>{location.city}, {location.state} {location.zip_code}</p>
                        </div>
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
      </Parallax>
    )
  }
}

let mapStateToProps = state => {
  return {
    activities: state.activities,
    trip: state.trip,
    membership: state.membership
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
