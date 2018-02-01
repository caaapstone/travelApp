import React, {Component} from 'react'
import {connect} from 'react-redux'
import Dragula from 'react-dragula'
import { fetchIdeas, fetchTrip, subscribeToTripThunkCreator, unsubscribeToTripThunkCreator, createActivity } from '../store'
import DraggableItem from './draggableItem'


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
      var tripId = this.props.match.params.tripId
      this.props.getTrip(tripId)
    }

    this.state.drake.on('drop', (el, target, source, sibling) => {
      console.log('dropped!')
      const id = el.id
      var selectedActivity = this.props.ideas.find(idea =>{
        return idea.id === id
      })
      var activity = {
        name: selectedActivity.name,
        lat: selectedActivity.coordinates.latitude,
        long: selectedActivity.coordinates.longitude,
        link: selectedActivity.url,
        imageUrl: selectedActivity.image_url,
        tripId: this.props.trip.id
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
    const { ideas, activities} = this.props
    let ideaActivities = activities.filter(activity => !activity.isActive)
    // calendarActivities -- do we need this on this page?
    let calendarActivities = activities.filter(activity => activity.isActive)

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
                    <DraggableItem activity={idea} />
                  </div>
                )})
              : <div />
            }
          </div>
        <div className="idea-board">
          <h2>Idea Board</h2>
          <div ref={this.dragulaDecorator} className="dragula-container">
            {
              ideaActivities.map(activity => {
                return (
                  <div key={activity.id} ref={this.dragulaDecorator}>
                    <DraggableItem activity={activity} />
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
