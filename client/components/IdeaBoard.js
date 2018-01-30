import React, {Component} from 'react'
import {connect} from 'react-redux'


class IdeaBoard extends Component {
  constructor() {
    super()
  }

 render() {
  console.log(this.props)
  return(<div></div>)
 }
}
//component did mount, go to firebase, get current activities
/**
 * CONTAINER
 */

const mapState = (state) => {

  return {
    user: state.user,
    trip: 1,
    activities: state.tripActivities
  }
}

export default connect(mapState)(IdeaBoard)

//search field
// dragula things
//post or put that happens on drop??
