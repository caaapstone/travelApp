import React, {Component} from 'react'
import {connect} from 'react-redux'
import YelpPopUp from './YelpPopUp'
import Modal from 'react-responsive-modal'
import {withRouter} from 'react-router-dom'
import StarRating from 'react-star-rating'

class DraggableYelpResult extends Component {
  constructor(){
    super()
    this.state = {
      open: false
    }
    this.onOpenModal = this.onOpenModal.bind(this)
    this.onCloseModal = this.onCloseModal.bind(this)
  }

  onOpenModal(activity){
    this.setState({ ...this.state, selectedActivity: activity, open: true });
    console.log('this.state(open): ', this.state)
  }

  onCloseModal(){
    this.setState({ ...this.state, selectedActivity: '', open: false });
    console.log('this.state(close): ', this.state)
  }


  render() {
    const { activity, currentUser } = this.props
    // the 'activity' prop is an object and includes the following:
    // activityId, date, imageUrl, link, isActive, lat, long, name, time, tripId
    //class Name "activity" has been removed if there are styling issues. add that back in first!
    let newClass = "activity"
    let now = new Date
    let time = now.getTime()
    let activityId = activity.activityId || activity.id
    if (activity.name){
      return (
        <div id={activityId} className="yelp-result-container" onClick={() => this.onOpenModal(activity)}>
          <Modal open={this.state.open} onClose={this.onCloseModal} little>
              <YelpPopUp activity={this.state.selectedActivity} />
          </Modal>
          <div className="yelp-result-image">
            <img src={activity.image_url} className="activity-thumbnail" />
          </div>
          <div className="yelp-result-text">
            <a href={activity.link} target="_blank">{activity.name}</a>
          </div>
        </div>
      )
    } else {
      return (
        <div />
      )
    }
  }
}

const mapState = (state, ownProps) => {
  let tripId = ownProps.match.params.tripId
  return {
    currentUser: state.user,
    users: state.users,
    tripId: tripId
  }
}

const mapDispatch = (dispatch) => {
  return {

  }
}

export default withRouter(connect(mapState, mapDispatch)(DraggableYelpResult))

