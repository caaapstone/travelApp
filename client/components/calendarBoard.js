import React from 'react';
import Dragula from 'react-dragula';
import firebase from '../firebase'
import {connect} from 'react-redux'
import { subscribeToTripThunkCreator, unsubscribeToTripThunkCreator, fetchTrip, updateActivity } from '../store';
import DraggableActivity from './draggableActivity'
import ActivityPopUp from './activityPopUp'
import Modal from 'react-responsive-modal'

export class CalendarBoard extends React.Component {
  constructor(){
    super();
    this.state = {
      drake: Dragula({
        // containers: []
      }),
      open: false,
      selectedActivity: {}
    }
    this.onOpenModal = this.onOpenModal.bind(this)
    this.onCloseModal = this.onCloseModal.bind(this)
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
      let now = new Date
      let timeUpdated = now.getTime()
      let userUpdated = this.props.user.firstName + ' ' + this.props.user.lastName
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
          <Modal open={this.state.open} onClose={this.onCloseModal} little>
            <ActivityPopUp activity={this.state.selectedActivity} />
          </Modal>
          <h3>Group Idea Bank</h3>
        <div className="group-ideas-container">
            {
              ideaActivities.length ?
                ideaActivities.map(activity => {
                   return (
                    <div
                      id="ideas"
                      ref={this.dragulaDecorator}
                      className="dragula-container"
                      onClick={() => this.onOpenModal(activity)}
                    >
                    <DraggableActivity activity={activity} key={activity.id} />
                    </div>
                  )
                }
                )
              : <div>All out of ideas!</div>
            }
          </div>
        <h3>Scheduler</h3>
          <div className="calendar-container">
            {
              dates.map(day => {
                return (
                  <div className="calendar-day-container">
                    <div>
                      <h3>{day}</h3>
                      <h3>Breakfast</h3>
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
                              <div onClick={() => this.onOpenModal(activity)}
                              >
                                <DraggableActivity activity={activity} key={activity.id} />
                              </div>
                            )
                          })
                        }
                    </div>
                  </div>
                  <br />
                  <div className="calendar-day-container">
                    <h3>Morning</h3>
                    <div
                      id="morning"
                      ref={this.dragulaDecorator}
                      title={day}
                      className="dragula-container"
                      onClick={() => this.onOpenModal(activity)}
                    >
                      {
                        morning.filter(morningActivity => {
                          return morningActivity.date === day
                        }).map(activity => {
                          return (
                            <div onClick={() => this.onOpenModal(activity)}
                              >
                            <DraggableActivity activity={activity} key={activity.id} />
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                  <br />
                  <div className="calendar-day-container">
                    <h3>Lunch</h3>
                      <div
                        id="lunch"
                        ref={this.dragulaDecorator}
                        title={day}
                        className="dragula-container"
                        onClick={() => this.onOpenModal(activity)}
                      >
                        {
                          lunch.filter(lunchActivity => {
                            return lunchActivity.date === day
                          }).map(activity => {
                            return (
                              <div onClick={() => this.onOpenModal(activity)}
                              >
                              <DraggableActivity activity={activity} key={activity.id} />
                              </div>
                            )
                          })
                        }
                      </div>
                    </div>
                  <br />
                  <div className="calendar-day-container">
                    <h3>Afternoon</h3>
                    <div
                      id="afternoon"
                      ref={this.dragulaDecorator}
                      title={day}
                      className="dragula-container"
                      onClick={() => this.onOpenModal(activity)}
                    >
                      {
                        afternoon.filter(afternoonActivity => {
                          return afternoonActivity.date === day
                        }).map(activity => {
                          return (
                            <div onClick={() => this.onOpenModal(activity)}
                              >
                            <DraggableActivity activity={activity} key={activity.id} />
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                  <br />
                  <div className="calendar-day-container">
                    <h3>Dinner</h3>
                    <div
                      id="dinner"
                      ref={this.dragulaDecorator}
                      title={day}
                      className="dragula-container"
                      onClick={() => this.onOpenModal(activity)}
                    >
                      {
                        dinner.filter(dinnerActivity => {
                          return dinnerActivity.date === day
                        }).map(activity => {
                          return (
                            <div onClick={() => this.onOpenModal(activity)}
                              >
                            <DraggableActivity activity={activity} key={activity.id} />
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                  <br />
                  <div className="calendar-day-container">
                    <h3>Evening</h3>
                    <div
                      id="evening"
                      ref={this.dragulaDecorator}
                      title={day}
                      className="dragula-container"
                      onClick={() => this.onOpenModal(activity)}
                    >
                      {
                        evening.filter(eveningActivity => {
                          return eveningActivity.date === day
                        }).map(activity => {
                          return (
                            <div onClick={() => this.onOpenModal(activity)}
                              >
                            <DraggableActivity activity={activity} key={activity.id} />
                            </div>
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
    updateActivity(activityObj){
      updateActivity(activityObj)
    }
  }
}

export default connect(mapState, mapDispatch)(CalendarBoard)

