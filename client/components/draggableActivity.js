import React, {Component} from 'react'
import {connect} from 'react-redux'
import ActivityPopUp from './activityPopUp'
import Modal from 'react-responsive-modal'
import {fetchUsersOnTrip} from '../store'
import {withRouter} from 'react-router-dom'

class DraggableItem extends Component {
  constructor(){
    super();
    this.state = {
      open: false,
      new: false
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

  componentDidMount(){
    // const { tripId } = this.props
    // if (!this.props.users.length){
    //   this.props.getTripUsers(tripId)
    // }
  }

  render() {
    const { activity, currentUser, users } = this.props
    // the 'activity' prop is an object and includes the following:
    // activityId, date, imageUrl, link, isActive, lat, long, name, time, tripId, users

    let now = new Date
    let time = now.getTime()
    let activityId = activity.activityId || activity.id

    let activityUserNames = []

    if (!this.props.users.length){
      return <div />
    } else {

      // if (time > activity.timeUpdated){
      //   this.setState({...this.state, new: true})
      // }

      users.forEach(user => {
        if (activity.users['U' + user.userId]){
          activityUserNames.push(user.name)
        }
      })

      return (
        <div
          id={activityId}
          className={this.state.new ? 'activity updated-activity' : 'activity'}
          onClick={() => this.onOpenModal(activity)}
        >
          <Modal open={this.state.open} onClose={this.onCloseModal} little>
              <ActivityPopUp activity={this.state.selectedActivity} />
          </Modal>
          <img src={activity.imageUrl} className="activity-thumbnail" />
          <a href={activity.link} target="_blank">{activity.name}</a>
          <br />
          Last updated by: { activity.userUpdated }<br />
          Selected by: { activityUserNames.map(name => <div key={name}>{name}</div>) }
        </div>
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
    getTripUsers(tripId){
      dispatch(fetchUsersOnTrip(tripId))
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(DraggableItem))
