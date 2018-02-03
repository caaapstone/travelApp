import React, {Component} from 'react'
import YelpResultPopUp from './activityPopUp'
import Modal from 'react-responsive-modal'

export default class DraggableYelpResult extends Component {
  constructor(){
    super();
    this.state = {
      open: false,
      selectedActivity: {}
    }
    this.onOpenModal = this.onOpenModal.bind(this)
    this.onCloseModal = this.onCloseModal.bind(this)
  }

  onOpenModal(activity){
    this.setState({ ...this.state, selectedActivity: activity, open: true });
    console.log('this.state(open): ', this.state)
  }

  onCloseModal(){
    this.setState({ ...this.state, selectedActivity: {}, open: false });
    console.log('this.state(close): ', this.state)
  }

  render() {
    const { activity, currentUser } = this.props
    // the 'activity' prop is an object and includes the following:
    // activityId, date, imageUrl, link, isActive, lat, long, name, time, tripId
    let now = new Date
    let time = now.getTime()
    let activityId = activity.activityId || activity.id
    return (
      <div id={activityId} className="yelp-result" onClick={() => this.onOpenModal(activity)}>
        <Modal open={this.state.open} onClose={this.onCloseModal} little>
          <YelpResultPopUp activity={this.state.selectedActivity} />
        </Modal>
        <img src={activity.image_url} className="activity-thumbnail" />
        <a href={activity.link} target="_blank">{activity.name}</a>
      </div>
    )
  }
}
