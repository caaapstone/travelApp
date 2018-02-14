import React, {Component} from 'react'

export default class ActivityPopUp extends Component {

  render() {
    let activity = this.props.activity
  if (activity.yelpInfo){
    activity = this.props.activity.yelpInfo
    return (
      <div className="modal">
        <h3><a href={activity.url} target="_blank">{activity.name}</a></h3>
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
      <div />
    )
  }
  }
}
