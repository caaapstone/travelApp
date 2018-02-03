import React, {Component} from 'react'

export default class ActivityPopUp extends Component {

  render() {
    let activity = this.props.activity
     // the 'activity' prop is an object and includes the following:
    // activityId, date, imageUrl, link, isActive, lat, long, name, time, tripId
    if (activity.yelpInfo){
    activity = this.props.activity.yelpInfo
    return (
      <div className="modal">
        <h3><a href={activity.link} target="_blank">{activity.name}</a></h3>
        <img src={activity.image_url} className="modal-image" />
        <br />
        <p>{activity.price}</p>
        <p>Rating: {activity.rating}</p>
        {activity.categories.map(category => <div key={category}>{category.title}</div>)}
        <p>{activity.display_phone}</p>
        <p>{activity.location.address1}</p>
        <p>{activity.location.address2}</p>
        <p>{activity.location.city}, {activity.location.state}</p>
      </div>
    )
  } else {
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
}
