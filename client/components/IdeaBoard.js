import React, {Component} from 'react'
import {connect} from 'react-redux'
import Dragula from 'react-dragula'
import { fetchIdeas, fetchTrip, subscribeToTripThunkCreator, unsubscribeToTripThunkCreator, createActivity } from '../store'
import firebase from '../firebase'


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
        console.log(el.id)
        const id = el.id
        var selectedActivity = this.props.ideas.find(idea =>{
          return idea.id === id
        })
        console.log(selectedActivity)
        var activity = {
          name: selectedActivity.name,
          lat: selectedActivity.coordinates.latitude,
          long: selectedActivity.coordinates.longitude,
          link: selectedActivity.url,
          imageUrl: selectedActivity.image_url,
          tripId: this.props.trip.id

        }
        //pass selected activity into post request thing
        // console.log("this.idea", this.props.ideas)
        // this.setState({
        //   selectedActivity: this.props.ideas
        // })
      //   let activityId = el.id
        this.props.createActivity(activity)

      // el.setAttribute('style', `${el.style.cssText};display: none;`);
      // this.state.drake.cancel(true)
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
    if (!this.props.ideas.length)
    {
      return (
              <form onSubmit={this.createIdeas}>
              <input
              name="yelp_search"
              id="yelp_search"
              />
              <button type="submit">click</button>
              </form>
              )

    }  else {
      return(
             <div>
             <form onSubmit={this.createIdeas}>
             <input
             name="yelp_search"
             id="yelp_search"
             />
             <button type="submit">click</button>
             </form>
             {
              this.props.ideas.map(idea =>{
                return(

                       <div ref={this.dragulaDecorator}>
                       <h3
                          id={idea.id}
                        >{idea.name}</h3>
                       </div>

                       )
              })
            }
            <div ref={this.dragulaDecorator}>
            <h2>drop here</h2>
            </div>
            </div>
            )

    }
  }
//drop here needs on drop firebase post
//should render all unactive activities
  dragulaDecorator = (componentBackingInstance) => {
    if (componentBackingInstance) {
      let options = { };
      this.state.drake.containers.push(componentBackingInstance)
    }
  }
}
//component did mount, go to firebase, get current activities
/**
 * CONTAINER
 */

 const mapState = (state) => {

  return {
    user: state.user,
    trip: state.trip,
    activities: state.tripActivities,
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

//search field
// dragula things
//post or put that happens on drop??
