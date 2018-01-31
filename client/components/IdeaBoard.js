import React, {Component} from 'react'
import {connect} from 'react-redux'
import Dragula from 'react-dragula'
import {fetchIdeas, fetchTrip} from '../store'

class IdeaBoard extends Component {
  constructor() {
    super()
    this.state = {
      drake: Dragula({})
    }
  }

  componentDidMount() {
    this.props.getTrips()

    this.state.drake.on('drop', (el, target, source, sibling) => {
      // PER COLLIN: Can probably derive order based on sibling...
      console.log('dropped for now')
      console.log('target.key: ', target.key)
      console.log(target.id, target.title)
      console.log("activity", el)
      console.log("activity id", el.id)
      console.log("source", source.id)
      console.log("sibling", sibling)
      // update state, dispatch put here
      // el is the thing you're moving
      // target is where you're putting it
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
                       <h3>{idea.name}</h3>
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
    trip: state.trip[3],
    activities: state.tripActivities,
    ideas: state.ideas
  }
}

const mapDispatch = (dispatch) => {
  return {
    getIdeas: (tripId, searchQuery) => {
      dispatch(fetchIdeas(tripId, searchQuery))
    },
    getTrips: () => {
      dispatch(fetchTrip())
    }
  }
}

export default connect(mapState, mapDispatch)(IdeaBoard)

//search field
// dragula things
//post or put that happens on drop??
