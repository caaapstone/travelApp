import React, {Component} from 'react'

export default class DraggableItem extends Component {

  render() {
    const { activity } = this.props
    // the 'activity' prop is an object and includes the following:
    // activityId, date, imageUrl, link, isActive, lat, long, name, time, tripId

    return (
      <div id={activity.id}>
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
