import React from 'react';
import Dragula from 'react-dragula';
import firebase from '../firebase'
import {connect} from 'react-redux'
import { subscribeToTripThunkCreator, unsubscribeToTripThunkCreator, fetchTrip, updateActivity, fetchUsersOnTrip } from '../store';
import DraggableActivity from './draggableActivity'
import ActivityPopUp from './activityPopUp'
import Modal from 'react-responsive-modal'
import {withRouter} from 'react-router-dom'

export class CalendarBoard extends React.Component {
  constructor(){
    super();
    this.state = {
      drake: Dragula({
        // containers: []
      }),
      open: false,
      selectedActivity: {},
      ideasToggle: 'all'
    }
    this.onOpenModal = this.onOpenModal.bind(this)
    this.onCloseModal = this.onCloseModal.bind(this)
    this.toggleMyIdeas = this.toggleMyIdeas.bind(this)
    this.toggleAllIdeas = this.toggleAllIdeas.bind(this)
    this.dateRange = this.dateRange.bind(this)
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
    if (!this.props.users.length){
      this.props.getTripUsers(tripId)
    }
    this.state.drake.on('drop', (el, target, source, sibling) => {
      let now = new Date
      let timeUpdated = now.getTime()
      let userUpdated = this.props.user.email
      let activityObj;
      if (target.id === 'ideas'){
        activityObj = {
          date: '',
          time: '',
          activityId: el.id,
          timeUpdated: timeUpdated,
          userUpdated: userUpdated,
          tripId: tripId,
          isActive: false
        }
      } else {
        activityObj = {
          date: target.title,
          time: target.id,
          activityId: el.id,
          timeUpdated: timeUpdated,
          userUpdated: userUpdated,
          tripId: tripId,
          isActive: true
        }
      }
      this.props.updateActivity(activityObj)
      el.setAttribute('style', `${el.style.cssText};display: none;`);
      this.state.drake.cancel(true)
    })
  }

  onOpenModal(activity){
    this.setState({ ...this.state, selectedActivity: activity, open: true });
  }

  onCloseModal(){
    this.setState({ ...this.state, selectedActivity: '', open: false });
  }

  toggleAllIdeas(){
    this.setState({ ...this.state, ideasToggle: 'all' })
  }

  toggleMyIdeas(){
    this.setState({ ...this.state, ideasToggle: 'mine' })
  }

  dateRange(date) {
    let splitDate = date.split('-')
    let newDate = [splitDate[1], splitDate[2], splitDate[0]]
    return newDate.join('/')
   }

  render() {
    if (!this.props.trip.allDates || !this.props.activities.length) {
      return <div />
    } else {
      // this cuts off unnecessary date data
      let dates = this.props.trip.allDates.map(date => date.slice(0, 10))
      let user = this.props.user.id
      let calendarActivities = this.props.activities.filter(activity => activity.isActive === true)
      let ideaActivities = []
      if (this.state.ideasToggle === 'mine'){
        ideaActivities = this.props.activities.filter(activity => {
          return !activity.isActive === false && activity.users['U' + user] === true
        })
      } else if (this.state.ideasToggle === 'all'){
        ideaActivities = this.props.activities.filter(activity => {
          return !activity.isActive
        })
      }

      // separate all activities into arrays based on time of day
      let breakfast = calendarActivities.filter(activity => activity.time === 'breakfast')
      let morning = calendarActivities.filter(activity => activity.time === 'morning')
      let lunch = calendarActivities.filter(activity => activity.time === 'lunch')
      let afternoon = calendarActivities.filter(activity => activity.time === 'afternoon')
      let dinner = calendarActivities.filter(activity => activity.time === 'dinner')
      let evening = calendarActivities.filter(activity => activity.time === 'evening')
      return (
        <div className="scheduler-outermost-div">
          <Modal open={this.state.open} onClose={this.onCloseModal} little>
            <ActivityPopUp activity={this.state.selectedActivity} />
          </Modal>
          <div className="full-scheduler-container">
            <div className="group-ideas-container-and-header">
              <h2 className="purple-sub-head">Ideas</h2>
              <button className="button scheduler-buttons" onClick={this.toggleAllIdeas}>All Ideas</button>
              <button className="button scheduler-buttons" onClick={this.toggleMyIdeas}>My Ideas</button>
              <div
                id="ideas"
                className="group-ideas-container dragula-container"
                ref={this.dragulaDecorator}
              >
                {
                  ideaActivities.length ?
                    ideaActivities.map(activity => {
                      return (
                        <DraggableActivity activity={activity} key={activity.id} />
                      )
                    })
                    : <div>All out of ideas!</div>
                }
              </div>
            </div>

            <div className="calendar-container-and-header">
            <div className="calendar-container">
              <div>
                <div className="calendar-day-date" />
                  <div className="calendar-day-time-container">
                    <div id="breakfast" className="time-of-day-container">
                      <div className="time-of-day">Breakfast</div>
                    </div>
                  </div>
                  <br />
                  <div className="calendar-day-time-container">
                    <div id="morning" className="time-of-day-container">
                      <div className="time-of-day">Morning</div>
                    </div>
                  </div>
                  <br />
                  <div className="calendar-day-time-container">
                    <div id="lunch" className="time-of-day-container">
                      <div className="time-of-day">Lunch</div>
                    </div>
                  </div>
                  <br />
                  <div className="calendar-day-time-container">
                    <div id="afternoon" className="time-of-day-container">
                      <div className="time-of-day">Afternoon</div>
                    </div>
                  </div>
                  <br />
                  <div className="calendar-day-time-container">
                    <div id="dinner" className="time-of-day-container">
                      <div className="time-of-day">Dinner</div>
                    </div>
                  </div>
                  <br />
                  <div className="calendar-day-time-container">
                    <div id="evening" className="time-of-day-container">
                      <div className="time-of-day">Evening</div>
                    </div>
                  </div>
                </div>
                {
                  dates.map(day => {
                    return (
                      <div>
                        <h3 className="calendar-day date">{day.slice(5) + '-' + day.slice(0,4)}</h3>
                        <div className="calendar-day-container">
                          <div
                            id="breakfast"
                            ref={this.dragulaDecorator}
                            title={day}
                            className="dragula-container"
                          >
                            {
                              breakfast.filter(breakfastActivity => {
                                return breakfastActivity.date === day
                              }).map(activity => {
                                return (
                                  <DraggableActivity activity={activity} key={activity.id} />
                                )
                              })
                            }
                          </div>
                        </div>
                        <br />
                        <div className="calendar-day-container">
                          <div
                            id="morning"
                            ref={this.dragulaDecorator}
                            title={day}
                            className="dragula-container"
                          >
                            {
                              morning.filter(morningActivity => {
                                return morningActivity.date === day
                              }).map(activity => {
                                return (
                                  <DraggableActivity activity={activity} key={activity.id} />
                                )
                              })
                            }
                          </div>
                        </div>
                        <br />
                        <div className="calendar-day-container">
                          <div
                            id="lunch"
                            ref={this.dragulaDecorator}
                            title={day}
                            className="dragula-container"
                          >
                            {
                              lunch.filter(lunchActivity => {
                                return lunchActivity.date === day
                              }).map(activity => {
                                return (
                                  <DraggableActivity activity={activity} key={activity.id} />
                                )
                              })
                            }
                          </div>
                        </div>
                        <br />
                        <div className="calendar-day-container">
                          <div
                            id="afternoon"
                            ref={this.dragulaDecorator}
                            title={day}
                            className="dragula-container"
                          >
                            {
                              afternoon.filter(afternoonActivity => {
                                return afternoonActivity.date === day
                              }).map(activity => {
                                return (
                                  <DraggableActivity activity={activity} key={activity.id} />
                                )
                              })
                            }
                          </div>
                        </div>
                        <br />
                        <div className="calendar-day-container">
                          <div
                            id="dinner"
                            ref={this.dragulaDecorator}
                            title={day}
                            className="dragula-container"
                          >
                            {
                              dinner.filter(dinnerActivity => {
                                return dinnerActivity.date === day
                              }).map(activity => {
                                return (
                                  <DraggableActivity activity={activity} key={activity.id} />
                                )
                              })
                            }
                          </div>
                        </div>
                        <br />
                        <div className="calendar-day-container">
                          <div
                            id="evening"
                            ref={this.dragulaDecorator}
                            title={day}
                            className="dragula-container"
                          >
                            {
                              evening.filter(eveningActivity => {
                                return eveningActivity.date === day
                              }).map(activity => {
                                return (
                                  <DraggableActivity activity={activity} key={activity.id} />
                                )
                              })
                            }
                          </div>
                        </div>
                        <br />
                      </div>
                    )
                  })
                }
              </div>
            </div>
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
    activities: state.activities,
    users: state.users
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
    updateActivity(activityObj){
      updateActivity(activityObj)
    },
    getTripUsers(tripId){
      dispatch(fetchUsersOnTrip(tripId))
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(CalendarBoard))

