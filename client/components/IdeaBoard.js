import React, {Component} from 'react'
import {connect} from 'react-redux'
import Dragula from 'react-dragula'
import { fetchIdeas, fetchTrip, subscribeToTripThunkCreator, unsubscribeToTripThunkCreator, createActivity } from '../store'
import DraggableActivity from './draggableActivity'
import DraggableYelpResult from './draggableYelpResult'


class IdeaBoard extends Component {
  constructor() {
    super()
    this.state = {
      drake: Dragula({}),
      selectedActivity: {}
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

  componentDidMount() {
    if (!this.props.trip.name) {
      let tripId = this.props.match.params.tripId
      this.props.getTrip(tripId)
    }

    this.state.drake.on('drop', (el, target, source, sibling) => {
      console.log('dropped!')
      let now = new Date
      let time = now.getTime()
      const id = el.id
      let userUpdated = this.props.user.firstName + ' ' + this.props.user.lastName
      let selectedActivity = this.props.ideas.find(idea => {
        return idea.id === id
      })
      let activity = {
        name: selectedActivity.name,
        lat: selectedActivity.coordinates.latitude,
        long: selectedActivity.coordinates.longitude,
        link: selectedActivity.url,
        imageUrl: selectedActivity.image_url,
        tripId: this.props.trip.id,
        timeUpdated: time,
        userUpdated: userUpdated
      }
      this.props.createActivity(activity)

      // prevents strange behavior due to DOM manipulation
      el.setAttribute('style', `${el.style.cssText};display: none;`);
      this.state.drake.cancel(true)
    })
  }

  createIdeas = (event) => {
    event.preventDefault();
    let tripId = this.props.trip.id
    let location = this.props.trip.destinationCity.toLowerCase()
    const search = {
      term: event.target.yelp_search.value,
      location: location
    }
    this.props.getIdeas(tripId, search)
  }

  render() {
    const { user, ideas, activities} = this.props
    let ideaActivities = activities.filter(activity => !activity.isActive)
    // calendarActivities -- do we need this on this page?
    // let calendarActivities = activities.filter(activity => activity.isActive)
    let userName = user.firstName + ' ' + user.lastName
    let userIdeas = ideaActivities.filter(activity => activity.userUpdated === userName)
    let groupIdeas = ideaActivities.filter(activity => activity.userUpdated !== userName)

      return (
        <div>
          <div className="idea-search">
            <form onSubmit={this.createIdeas}>
              <input
                name="yelp_search"
                id="yelp_search"
                />
              <button type="submit">click</button>
            </form>
            {
              ideas.length ?
              ideas.map(idea => {
                return (
                  <div key={idea.id} ref={this.dragulaDecorator}>
                    <DraggableYelpResult activity={idea} />
                  </div>
                )})
              : <div />
            }
          </div>
        <div className="idea-board">
          <h2>Idea Board</h2>
          <div ref={this.dragulaDecorator} className="dragula-container">
            {
              userIdeas.map(activity => {
                return (
                  <div key={activity.id} ref={this.dragulaDecorator}>
                    <DraggableActivity activity={activity} />
                  </div>
                )})
            }
          </div>
        </div>
        <div className="friend-ideas">
          <h2>Group Ideas</h2>
          <div ref={this.dragulaDecorator} className="dragula-container">
            {
              groupIdeas.map(activity => {
                return (
                  <div key={activity.id} ref={this.dragulaDecorator}>
                    <DraggableActivity activity={activity} />
                  </div>
                )})
            }
          </div>
        </div>
      </div>
    )
  }

  dragulaDecorator = (componentBackingInstance) => {
    if (componentBackingInstance) {
      let options = { };
      this.state.drake.containers.push(componentBackingInstance)
    }
  }
}

 const mapState = (state) => {
  return {
    user: state.user,
    trip: state.trip,
    activities: state.activities,
    ideas: state.ideas
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
    getIdeas: (tripId, searchQuery) => {
      dispatch(fetchIdeas(tripId, searchQuery))
    },
    getTrip: (tripId) => {
      dispatch(fetchTrip(tripId))
    },
    createActivity(activity) {
      createActivity(activity)
    }
  }
}

export default connect(mapState, mapDispatch)(IdeaBoard)
