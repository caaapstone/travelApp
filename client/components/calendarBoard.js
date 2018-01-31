import React from 'react';
import Dragula from 'react-dragula';
import firebase from '../firebase'
import {connect} from 'react-redux'
import { subscribeToTripThunkCreator, unsubscribeToTripThunkCreator, fetchTrip, updateActivity } from '../store';

export class CalendarBoard extends React.Component {
  constructor(){
    super();
    this.state = {
      drake: Dragula({
        // containers: []
      })
    }
  }

  dragulaDecorator = (componentBackingInstance) => {
    if (componentBackingInstance) {
      let options = { };
      // Dragula([componentBackingInstance], options);
      this.state.drake.containers.push(componentBackingInstance)
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
    let tripId = this.props.match.params.tripId
    if (!this.props.trip.name){
      this.props.getTripInfo(tripId)
    }
    this.state.drake.on('drop', (el, target, source, sibling) => {
      // PER COLLIN: Can probably derive order based on sibling...
      console.log('dropped!')
      var active = true
      if (target.id === 'ideas'){
        let date = ''
        let time = ''
        let activityId = el.id
        this.props.updateActivity(date, time, activityId, tripId, !active)
      } else {
        this.props.updateActivity(target.title, target.id, el.id, tripId, active)
      }
      el.setAttribute('style', `${el.style.cssText};display: none;`);
      this.state.drake.cancel(true)
    })
  }

  render () {
    if (!this.props.trip.allDates || !this.props.activities.length){
      return <div />
    } else {
      // this cuts off unnecessary date data
      let dates = this.props.trip.allDates.map(date => date.slice(0,10))

      let calendarActivities = this.props.activities.filter(activity => activity.isActive === true)
      let ideaActivities = this.props.activities.filter(activity => activity.isActive === false)

      // separate all activities into arrays based on time of day
      let breakfast = calendarActivities.filter(activity => activity.time === 'breakfast')
      let morning = calendarActivities.filter(activity => activity.time === 'morning')
      let lunch = calendarActivities.filter(activity => activity.time === 'lunch')
      let afternoon = calendarActivities.filter(activity => activity.time === 'afternoon')
      let dinner = calendarActivities.filter(activity => activity.time === 'dinner')
      let evening = calendarActivities.filter(activity => activity.time === 'evening')

      return (
        <div>
          CALENDAR BOARD:
          <div>
            {
              dates.map(day => {
                return (
                  <div>
                  <h3>{day}</h3>
                  <h3>Breakfast</h3>
                  <div id="breakfast" ref={this.dragulaDecorator} title={day}>
                    {
                      breakfast.filter(breakfastActivity => {
                        return breakfastActivity.date === day
                      }).map(activity => {
                        return (
                          <div id={activity.activityId} key={activity.activityId}>{activity.name}</div>
                        )
                      })
                    }
                  </div>
                    <br />
                    <h3>Morning</h3>
                    <div id="morning" ref={this.dragulaDecorator} title={day}>
                      {
                        morning.filter(morningActivity => {
                          return morningActivity.date === day
                        }).map(activity => {
                          return (
                            <div id={activity.activityId} key={activity.activityId}>{activity.name}</div>
                          )
                        })
                      }
                    </div>
                    <br />
                    <h3>Lunch</h3>
                    <div id="lunch" ref={this.dragulaDecorator} title={day}>
                      {
                        lunch.filter(lunchActivity => {
                          return lunchActivity.date === day
                        }).map(activity => {
                          return (
                            <div id={activity.activityId} key={activity.activityId}>{activity.name}</div>
                          )
                        })
                      }
                    </div>
                    <br />
                    <h3>Afternoon</h3>
                    <div id="afternoon" ref={this.dragulaDecorator} title={day}>
                      {
                        afternoon.filter(afternoonActivity => {
                          return afternoonActivity.date === day
                        }).map(activity => {
                          return (
                            <div id={activity.activityId} key={activity.activityId}>{activity.name}</div>
                          )
                        })
                      }
                    </div>
                    <br />
                    <h3>Dinner</h3>
                    <div id="dinner" ref={this.dragulaDecorator} title={day}>
                      {
                        dinner.filter(dinnerActivity => {
                          return dinnerActivity.date === day
                        }).map(activity => {
                          return (
                            <div id={activity.activityId} key={activity.activityId}>{activity.name}</div>
                          )
                        })
                      }
                    </div>
                    <br />
                    <h3>Evening</h3>
                    <div id="evening" ref={this.dragulaDecorator} title={day}>
                      {
                        evening.filter(eveningActivity => {
                          return eveningActivity.date === day
                        }).map(activity => {
                          return (
                            <div id={activity.activityId} key={activity.activityId}>{activity.name}</div>
                          )
                        })
                      }
                    </div>
                    <br />
                  </div>
                )
              })
            }
          </div>
        IDEAS:
        <div>
            {
              ideaActivities.length ?
              ideaActivities.map(activity =>
                <div id="ideas" ref={this.dragulaDecorator}>
                <div id={activity.activityId} key={activity.activityId}>{activity.name}</div>
                </div>
              )
              : <div>All out of ideas!</div>
            }
          </div>
        </div>
      )
    }
  }

}

const mapState = (state) => {
  return {
    user: state.user,
    trip: state.trip,
    activities: state.activities
  }
}

const mapDispatch = (dispatch) => {
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
    updateActivity(date, time, activityId, tripId, active){
      console.log('date: ', date)
      console.log('time: ', time)
      console.log('activityId: ', activityId)
      console.log('tripId: ', tripId)
      updateActivity(date, time, activityId, tripId, active)
    }
  }
}

export default connect(mapState, mapDispatch)(CalendarBoard)

      //if day number equals day we're on
      // <div>
      // <div id='container1' ref={this.dragulaDecorator} title='Monday'>
      //   <div>Swap her around</div>
      //   <div>Swap him around</div>
      //   <div>Swap them around</div>
      //   <div>Swap us around</div>
      //   <div>Swap things around</div>
      //   <div>Swap everything around</div>
      // </div>
      // <br />
      // <br />
      // <div id='container2' ref={this.dragulaDecorator} title='Tuesday'>
      //   <div>Swap us around</div>
      //   <div>Swap you around</div>
      //   <div>Swap EVERYONE around</div>
      //   <div>Swap them around</div>
      //   <div>Swap ALL THE THINGS around</div>
      //   <div>Swap things around</div>
      //   <div>Swap everything around</div>
      // </div>
      // </div>
