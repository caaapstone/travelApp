import React, {Component} from 'react'
import {connect} from 'react-redux'
import ActivityPopUp from './activityPopUp'
import Modal from 'react-responsive-modal'
import {withRouter} from 'react-router-dom'
import Gravatar from 'react-gravatar'
import ReactTooltip from 'react-tooltip'

class DraggableItem extends Component {
  constructor(){
    super();
    this.state = {
      open: false
    }
    this.onOpenModal = this.onOpenModal.bind(this)
    this.onCloseModal = this.onCloseModal.bind(this)
  }

  onOpenModal(activity){
    this.setState({ ...this.state, selectedActivity: activity, open: true });
  }

  onCloseModal(){
    this.setState({ ...this.state, selectedActivity: '', open: false });
  }

  render() {
    const { activity, currentUser, users } = this.props
    // the 'activity' prop is an object and includes the following:
    // activityId, date, imageUrl, link, isActive, lat, long, name, time, tripId, users

    let now = new Date
    let time = now.getTime()
    let timeDiff = time - activity.timeUpdated
    let activityId = activity.activityId || activity.id
    let newClass = "activity"
    let activityUserEmails = []

    if (!this.props.users.length){
      return <div />
    } else {

      if (timeDiff <= 30000){
        newClass = "activity thirty-seconds"
      } else if (timeDiff > 30000 && timeDiff <= 3600000){
        newClass = "activity hour"
      } else if (timeDiff > 3600000 && timeDiff <= 86400000){
        newClass = "activity day"
      }

      users.forEach(user => {
        if (activity.users['U' + user.userId]){
          activityUserEmails.push(user.userEmail)
        }
      })

      return (
        <div
          id={activityId}
          className={newClass}
          onClick={() => this.onOpenModal(activity)}
        >
          <Modal open={this.state.open} onClose={this.onCloseModal} little>
            <ActivityPopUp activity={this.state.selectedActivity} />
          </Modal>
          <ReactTooltip />

          <div className="single-activity-container">
            <div className="single-activity-image">
              <img src={activity.imageUrl} className="activity-thumbnail" />
            </div>
            <div className="single-activity-text">
              <a className="single-activity-name-link" href={activity.link} target="_blank">{activity.name}</a>
              <br />
              Last updated by: <a data-tip={activity.userUpdated}>
              <Gravatar className="gravatar" email={activity.userUpdated} size={12} />
            </a>
            <br />
            Selected by:
              {
                activityUserEmails.map(email =>
                  <a data-tip={email}>
                    <Gravatar className="gravatar" email={email} size={12} />
                  </a>)
              }
            </div>
          </div>
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

  }
}

export default withRouter(connect(mapState, mapDispatch)(DraggableItem))
