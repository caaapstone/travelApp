import React, {Component} from 'react'
import {connect} from 'react-redux'

class DraggableItem extends Component {

  render() {
    const { activity, currentUser, tripUsers } = this.props
    // the 'activity' prop is an object and includes the following:
    // activityId, date, imageUrl, link, isActive, lat, long, name, time, tripId, users

    let now = new Date
    let time = now.getTime()
    let activityId = activity.activityId || activity.id

    let activityUserNames = []
    tripUsers.forEach(user => {
      if (activity.users['U' + user.user.id]){
        activityUserNames.push(user.user.firstName)
      }
    })

    return (
      <div id={activityId} className="activity">
        <img src={activity.imageUrl} className="activity-thumbnail" />
        <a href={activity.link} target="_blank">{activity.name}</a>
        <br />
        placeholder for address<br />
        placeholder for rating<br />
        placeholder for cost<br />
        placeholder for cost<br />
        Last updated by: { activity.userUpdated }<br />
        Selected by: { activityUserNames.map(name => <div key={name}>{name}</div>) }
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    currentUser: state.user,
    tripUsers: state.users
  }
}

export default connect(mapState)(DraggableItem)
