import React, {Component} from 'react'

export default class DraggableYelpResult extends Component {

  render() {
    const { activity, currentUser } = this.props
    // the 'activity' prop is an object and includes the following:
    // activityId, date, imageUrl, link, isActive, lat, long, name, time, tripId
    let now = new Date
    let time = now.getTime()
    let activityId = activity.activityId || activity.id
    return (
      <div id={activityId} className="activity-border">
        <img src={activity.imageUrl} className="activity-thumbnail" />
        <a href={activity.link} target="_blank">{activity.name}</a>
        <br />
        placeholder for address<br />
        placeholder for rating<br />
        placeholder for cost<br />
        placeholder for cost<br />
      </div>
    )
  }
}
