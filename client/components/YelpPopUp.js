import React, {Component} from 'react'

export default class YelpPopUp extends Component {

  render() {
    let idea = this.props.activity
     // the 'activity' prop is an object and includes the following:
    // activityId, date, imageUrl, link, isActive, lat, long, name, time, tripId
  if (idea.name){
    // idea = this.props.idea.yelpInfo
    return (
      <div className="modal">
        <h3><a href={idea.url} target="_blank">{idea.name}</a></h3>
        <img src={idea.image_url} className="modal-image" />
        <br />
        <p>{idea.price}</p>
        <p>Rating: {idea.rating}</p>
        {idea.categories.map(category => <div key={category}>{category.title}</div>)}
        <p>{idea.display_phone}</p>
        <p>{idea.location.address1}</p>
        <p>{idea.location.address2}</p>
        <p>{idea.location.city}, {idea.location.state}</p>
      </div>
    )
  } else {
    return (
      <div />
    )
  }
  }
}
