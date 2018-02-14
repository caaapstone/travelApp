import React, {Component} from 'react'

export default class DemoPopUp extends Component {

  render() {
    return (
      <div className="modal">
        <h3>Welcome!</h3>
        <p>Thanks for visiting Flock. Normally, you would first invite your friends to join you on a trip, enter your separate budgets, and generate a list of fun destinations.</p>
        <br />
        <p>For demo purposes, we're going to skip ahead a bit. Congratulations, you're going to Seattle!</p>
        <br />
        <p>Click around on your Trip Dashboard to add ideas to your personal Idea Board, move your and your friends' ideas onto the Schedule, check out the Map for day-by-day routes, and view your finished Itinerary.</p>
      </div>
    )
  }
}
