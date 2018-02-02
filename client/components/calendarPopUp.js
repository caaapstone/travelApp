import React, {Component} from 'react'

export default class CalendarPopUp extends Component {

  render() {
    const { activity } = this.props
     // the 'activity' prop is an object and includes the following:
    // activityId, date, imageUrl, link, isActive, lat, long, name, time, tripId
    return (
      <div className="modal">
        <h3>{activity.name}</h3>
        <img src={activity.imageUrl} className="modal-image" />
        <br />
        Here is going to be a bunch of information about this one thing!
      </div>
    )
  }
}
