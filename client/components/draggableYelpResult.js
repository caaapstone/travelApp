import React, {Component} from 'react'

export default class DraggableYelpResult extends Component {

  render() {
    const { activity, currentUser } = this.props
    // the 'activity' prop is an object and includes the following:
    // activityId, date, imageUrl, link, isActive, lat, long, name, time, tripId
    let now = new Date
    let time = now.getTime()
    let activityId = activity.activityId || activity.id
    if (activity.name){
      return (
        <div id={activityId} className="yelp-result-container">
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
