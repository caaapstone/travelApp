import React, {Component} from 'react'
import {connect} from 'react-redux'
import Dragula from 'react-dragula'
import { fetchIdeas, fetchTrip, subscribeToTripThunkCreator, unsubscribeToTripThunkCreator, createActivity, fetchParticipants } from '../store'
import DraggableActivity from './draggableActivity'
import DraggableYelpResult from './draggableYelpResult'
import Modal from 'react-responsive-modal'
import {withRouter} from 'react-router-dom'
import Loading from 'react-loading-components'
import { setTimeout } from 'timers'

class IdeaBoard extends Component {
  constructor() {
    super()
    this.state = {
      drake: Dragula({}),
      selectedActivity: {},
      open: false,
      loading: false
    }
    this.onOpenModal = this.onOpenModal.bind(this)
    this.onCloseModal = this.onCloseModal.bind(this)
    this.toggleLoading = this.toggleLoading.bind(this)
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
    let tripId = this.props.match.params.tripId
    if (!this.props.trip.name) {
      this.props.getTrip(tripId)
    }
    if (!this.props.users.length){
      this.props.getTripUsers(tripId)
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
        userUpdated: userUpdated,
        userId: this.props.user.id,
        yelpInfo: selectedActivity
      }
      this.props.createActivity(activity)

      // prevents strange behavior due to DOM manipulation
      el.setAttribute('style', `${el.style.cssText};display: none;`);
      this.state.drake.cancel(true)
    })
  }

  createIdeas = (event) => {
    event.preventDefault();
    this.setState({loading: true})
    let tripId = this.props.trip.id
    let location = this.props.trip.destinationCity.toLowerCase()
    const search = {
      term: event.target.yelp_search.value,
      location: location
    }
    setTimeout(this.toggleLoading, 1900)
    setTimeout(this.props.getIdeas(tripId, search), 2000)
  }

  onOpenModal(activity){
    this.setState({ ...this.state, selectedActivity: activity, open: true });
    console.log('this.state(open): ', this.state)
  }

  onCloseModal(){
    this.setState({ ...this.state, selectedActivity: '', open: false });
    console.log('this.state(close): ', this.state)
  }

  toggleLoading() {
    this.setState({loading: false})
  }
  render() {
    const { user, ideas, activities} = this.props
    let ideaActivities = activities.filter(activity => !activity.isActive)

    let userName = user.firstName + ' ' + user.lastName

    let userIdeas = []
    let groupIdeas = []

    for ( let activity in ideaActivities){
      if (!ideaActivities[activity].users['U' + user.id]){
        groupIdeas.push(ideaActivities[activity])
      } else if (ideaActivities[activity].users['U' + user.id] === true){
        userIdeas.push(ideaActivities[activity])
      }
    }
// console.log("before return in render", this.state.loading)
      return (
        <div>
        <Modal open={this.state.open} onClose={this.onCloseModal} little>
            {/* need some sort of yelp result pop up */}
          </Modal>
        <div id="boards">
          <div className="idea-search">
          <h4>Activity Search</h4>
            <form onSubmit={this.createIdeas}>
              <input
                name="yelp_search"
                id="yelp_search"
              />
              <button type="submit">Search</button>
            </form>
            <div ref={this.dragulaDecorator}>
        {
          this.state.loading
          ? <div className="text-align-center">
            <Loading type="puff" width={200} height={200} fill="#7E4E60" className="center-loading"/>
            </div>
          : ideas.length ?
          <div>
            {
                ideas.map(idea => {
              console.log("in ideas", this.state.loading)
                  return (
                      <DraggableYelpResult activity={idea} />
                    )
                  })
                }
                </div>
                  : <div />

                }

                </div>
              </div>
            <div id="user">
              <h2>Idea Board</h2>
              <div className="idea-board dragula-container" ref={this.dragulaDecorator}>

                {
                  userIdeas.map(activity => {
                    return (
                      <DraggableActivity activity={activity} />
                    )
                  })
                }

              </div>
            </div>
            <div id="group">
              <h2>Group Ideas</h2>
              <div className="friend-ideas dragula-container" ref={this.dragulaDecorator}>
                {
                  groupIdeas.map(activity => {
                    return (
                          <DraggableActivity activity={activity} />
                        )
                      })
                    }
              </div>
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
    ideas: state.ideas,
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
    getIdeas(tripId, searchQuery) {
      dispatch(fetchIdeas(tripId, searchQuery))
    },
    getTrip(tripId) {
      dispatch(fetchTrip(tripId))
    },
    getTripUsers(tripId){
      dispatch(fetchParticipants(tripId))
    },
    createActivity(activity) {
      createActivity(activity)
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(IdeaBoard))
