import React, {Component} from 'react'
import {connect} from 'react-redux'
import Dragula from 'react-dragula'
import { fetchIdeas, fetchTrip, subscribeToTripThunkCreator, unsubscribeToTripThunkCreator, createActivity, fetchUsersOnTrip, updateActivity, updateOrDeleteActivity } from '../store'
import DraggableActivity from './draggableActivity'
import DraggableYelpResult from './draggableYelpResult'
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
      loading: false,
      trashImg: '/005-trash.svg'
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

    // when activity is dragged over trash icon
    this.state.drake.on('over', (el, target, source, sibling) => {
      if (el.id[0] === '-' && target.id === 'trash'){
        this.setState({...this.state, trashImg: '/006-trash.svg'})
      }
    })

    // when activity leaves trash icon
    this.state.drake.on('out', (el, target, source, sibling) => {
      if (el.id[0] === '-'){
        this.setState({...this.state, trashImg: '/005-trash.svg'})
      }
    })

    this.state.drake.on('drop', (el, target, source, sibling) => {
      let now = new Date
      let time = now.getTime()
      const id = el.id
      let userUpdated = this.props.user.firstName + ' ' + this.props.user.lastName

      // if a yelp result is dragged to my ideas or friends ideas
      if ((target.id === 'my-ideas' || target.id === 'friends-ideas') && el.id[0] !== '-'){
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

      // if an idea is dragged from group ideas to my ideas
      } else if (target.id === 'my-ideas' && el.id[0] === '-'){
        let activity = {
          tripId: this.props.trip.id,
          activityId: el.id,
          date: '',
          time: '',
          isActive: false,
          timeUpdated: time,
          userUpdated: userUpdated,
          userId: this.props.user.id
        }
        this.props.updateActivity(activity)

      // if an idea is dragged to trash icon from the idea board (cannot delete from group ideas)
      } else if (target.id === 'trash' && el.id[0] === '-'){
        let activity = {
          tripId: this.props.trip.id,
          activityId: el.id,
          date: '',
          time: '',
          timeUpdated: time,
          userUpdated: userUpdated,
          userId: this.props.user.id,

        }
        this.props.removeFromIdeaBoard(activity)
      }

      // prevents strange behavior due to DOM manipulation
      el.setAttribute('style', `${el.style.cssText};display: none;`);
      this.state.drake.cancel(true)
    })
  }

  createIdeas = (event, category) => {
    event.preventDefault();
    this.setState({loading: true})
    let tripId = this.props.trip.id
    let location = this.props.trip.destinationCity.toLowerCase()
    const search = {
      term: category || event.target.yelp_search.value,
      location: location
    }
    setTimeout(this.toggleLoading, 1900)
    setTimeout(this.props.getIdeas(tripId, search), 2000)
  }

  onOpenModal(activity){
    this.setState({ ...this.state, selectedActivity: activity, open: true });
  }

  onCloseModal(){
    this.setState({ ...this.state, selectedActivity: '', open: false });
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

    for (let activity in ideaActivities) {
      if (!ideaActivities[activity].users['U' + user.id]) {
        groupIdeas.push(ideaActivities[activity])
      } else if (ideaActivities[activity].users['U' + user.id] === true) {
        userIdeas.push(ideaActivities[activity])
      }
    }
    return (
      <div>
        <div id="boards">
          <div className="idea-search">
            <h2 className="purple-sub-head">Activity Search</h2>
            <p>Click on a popular category below for a quick search, or search on your own. Then, drag your favorites over to your idea board.</p>
            <div className="search-icons">
              <img onClick={(event) => this.createIdeas(event, 'museums')} src="/001-banks.svg" className="icon" />
              <img onClick={(event) => this.createIdeas(event, 'coffee')} src="/002-coffee.svg" className="icon" />
              <img onClick={(event) => this.createIdeas(event, 'restaurants')} src="/003-pizza.svg" className="icon" />
              <img onClick={(event) => this.createIdeas(event, 'bars')} src="/004-pint.svg" className="icon" />
            </div>
            <form onSubmit={this.createIdeas}>
              <input
                name="yelp_search"
                id="yelp_search"
              />
              <button className="button idea-search-button" type="submit">Search</button>
            </form>
            {
              this.state.loading
                ? <div className="text-align-center">
                  <Loading type="puff" width={200} height={200} fill="#7E4E60" className="center-loading" />
                </div>
                : ideas.length ?
                  <div ref={this.dragulaDecorator}>
                    {
                      ideas.map(idea => {
                        return (
                          <DraggableYelpResult activity={idea} />
                        )
                      })
                    }
                  </div>
                  : <div />
            }
          </div>
          <div id="user">
            <div className="header-and-trash">
              <img id="trash" className="trash" src={this.state.trashImg} ref={this.dragulaDecorator} />
            </div>
            <div id="my-ideas" className="idea-board dragula-container" ref={this.dragulaDecorator}>
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
            <h2 className="purple-sub-head">Group Ideas</h2>
            <p>Take a look at your friends' ideas! You can even drag them into your own idea board.</p>
            <div id="friends-ideas" className="friend-ideas dragula-container" ref={this.dragulaDecorator}>
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
      let options = {};
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
      dispatch(fetchUsersOnTrip(tripId))
    },
    createActivity(activity) {
      createActivity(activity)
    },
    updateActivity(activity){
      updateActivity(activity)
    },
    removeFromIdeaBoard(activity){
      updateOrDeleteActivity(activity)
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(IdeaBoard))
