import React from "react";
import Dragula from 'react-dragula';
// import Item from '../components'

export default class App extends React.Component {
  constructor(){
    super();
    this.state = {
      drake: Dragula({
        // containers: []
      })
    }
  }

  componentDidMount(){
    this.state.drake.on('drop', (el, target, source, sibling) => {
      // PER COLLIN: Can probably derive order based on sibling...
      console.log('dropped for now')
      console.log('target.key: ', target.key)
      console.log(target.id, target.title)
      console.log("activity", el)
      console.log("activity id", el.id)
      console.log("source", source.id)
      console.log("sibling", sibling)
      // update state, dispatch put here
      // el is the thing you're moving
      // target is where you're putting it
    })
  }

  render () {
    console.log('this.state.drake: ', this.state.drake)
    let breakfast = [
      {
        id: 2,
        name: "IHOP",
        location: "NYC",
        day: 1,
        time: "breakfast",
        tripId: 1
      },
      {
        id: 8,
        name: "Denny's",
        location: "NYC",
        day: 2,
        time: "breakfast",
        tripId: 1
      }
    ]

    let morning = [
      {
        id: 1,
        name: "MoMA",
        location: "NYC",
        day: 1,
        time: "morning",
        tripId: 1
      },
      {
        id: 7,
        name: "Met",
        location: "NYC",
        day: 2,
        time: "morning",
        tripId: 1
      }
    ]

    let lunch = [
      {
        id: 3,
        name: "Subway",
        location: "NYC",
        day: 1,
        time: "lunch",
        tripId: 1
      },
      {
        id: 9,
        name: "Potbelly's",
        location: "NYC",
        day: 2,
        time: "lunch",
        tripId: 1
      },
      {
        id: 13,
        name: "Lunching Place",
        location: "NYC",
        day: 2,
        time: "lunch",
        tripId: 1
      }
    ]

    let afternoon = [
      {
        id: 4,
        name: "UCB",
        location: "NYC",
        day: 1,
        time: "afternoon",
        tripId: 1
      },
      {
        id: 10,
        name: "Central Park",
        location: "NYC",
        day: 2,
        time: "afternoon",
        tripId: 1
      }
    ]

      let dinner = [
        {
          id: 5,
          name: "Daniel",
          location: "NYC",
          day: 1,
          time: "dinner",
          tripId: 1
        },
        {
          id: 11,
          name: "Caffe Storico",
          location: "NYC",
          day: 2,
          time: "dinner",
          tripId: 1
        }
      ]

      let evening = [
        {
          id: 6,
          name: "Whiskey Library",
          location: "NYC",
          day: 1,
          time: "evening",
          tripId: 1
        },
        {
          id: 12,
          name: "McSorley's",
          location: "NYC",
          day: 2,
          time: "evening",
          tripId: 1
        }
      ]

      let days = [1, 2]

    return (

      days.map(day => {
        return (
          <div>
          <h3>Breakfast</h3>
            <div id="breakfast" ref={this.dragulaDecorator} title={day}>
              {breakfast.filter(breakfastActivity => {
                return breakfastActivity.day === day
              }).map(activity => {
                return (
                  <div>
                  <div id={activity.id} key={activity.id}>{activity.name}</div>
                  <div></div>
                  </div>
                )
              })
              }
            </div>
            <h3>Morning</h3>
            <div id="morning" ref={this.dragulaDecorator} title={day}>
              {morning.filter(morningActivity => {
                return morningActivity.day === day
              }).map(activity => {
                return (
                  <div id={activity.id} key={activity.id}>{activity.name}</div>
                )
              })
              }
            </div>
            <h3>Lunch</h3>
            <div id="lunch" ref={this.dragulaDecorator} title={day}>
              {lunch.filter(lunchActivity => {
                return lunchActivity.day === day
              }).map(activity => {
                return (
                  <div id={activity.id} key={activity.id}>{activity.name}</div>
                )
              })
              }
            </div>
            <h3>Afternoon</h3>
            <div id="afternoon" ref={this.dragulaDecorator} title={day}>
              {afternoon.filter(afternoonActivity => {
                return afternoonActivity.day === day
              }).map(activity => {
                return (
                  <div id={activity.id} key={activity.id}>{activity.name}</div>
                )
              })
              }
            </div>
            <h3>Dinner</h3>
            <div id="dinner" ref={this.dragulaDecorator} title={day}>
              {dinner.filter(dinnerActivity => {
                return dinnerActivity.day === day
              }).map(activity => {
                return (
                  <div id={activity.id} key={activity.id}>{activity.name}</div>
                )
              })
              }
            </div>
            <h3>Evening</h3>
            <div id="evening" ref={this.dragulaDecorator} title={day}>
              {evening.filter(eveningActivity => {
                return eveningActivity.day === day
              }).map(activity => {
                return (
                  <div id={activity.id} key={activity.id}>{activity.name}</div>
                )
              })
              }
            </div>
          </div>
        )
      })

      //if day number equals day we're on
      // <div>
      // <div id='container1' ref={this.dragulaDecorator} title='Monday'>
      //   <div>Swap her around</div>
      //   <div>Swap him around</div>
      //   <div>Swap them around</div>
      //   <div>Swap us around</div>
      //   <div>Swap things around</div>
      //   <div>Swap everything around</div>
      // </div>
      // <br />
      // <br />
      // <div id='container2' ref={this.dragulaDecorator} title='Tuesday'>
      //   <div>Swap us around</div>
      //   <div>Swap you around</div>
      //   <div>Swap EVERYONE around</div>
      //   <div>Swap them around</div>
      //   <div>Swap ALL THE THINGS around</div>
      //   <div>Swap things around</div>
      //   <div>Swap everything around</div>
      // </div>
      // </div>
    )

  }

  dragulaDecorator = (componentBackingInstance) => {
    if (componentBackingInstance) {
      let options = { };
      // Dragula([componentBackingInstance], options);
      this.state.drake.containers.push(componentBackingInstance)
    }
  }

}


// import React, {Component} from 'react'
// // import PropTypes from 'prop-types'
// import {connect} from 'react-redux'
// // import { DragDropContextProvider } from 'react-dnd';
// // import HTML5Backend from 'react-dnd-html5-backend'
// // import { Target, Source } from '../components'

// class CalendarBoard extends Component {
//   constructor(props){
//     super(props)
//     this.state = {
//       activities: [
// 				{ id: 7, name: 'The Met', date: '', accepts: ['test'], lastDroppedItem: null },
//         { id: 2, name: 'Garbage Can', accepts: ['test'], lastDroppedItem: null },
//         { id: 4, name: 'Zoo', accepts: ['test'], lastDroppedItem: null }
// 			],
// 			sources: [
// 				{ id: 6, name: 'Bottle', type: ['test'] },
// 				{ id: 9, name: 'Old banana', type: ['test'] },
//         { id: 1, name: 'Newspaper', type: ['test'] },
//         { id: 3, name: 'Elephant', type: ['test'] },
// 			],
//     }
//   }


//   render(){
//     const { targets, sources } = this.state

//     return (
//       <DragDropContextProvider backend={HTML5Backend}>
//         <div>
//           <div>
//             {
//               targets.map(target => (
//                 <Target
//                   name={target.name}
//                   id={target.id}
//                   onDrop={(item) => this.handleDrop(item, target.id)}
//                   key={target.id}
//                 />
//               ))
//             }
//           </div>
//           <div>
//             {
//               sources.map(source => (
//                 <Source
//                   name={source.name}
//                   isDropped={this.isDropped(source.name)}
//                   key={source.id}
//                 />
//               ))
//             }
//           </div>
//         </div>
//       </DragDropContextProvider>
//     )
//   }
// }

// const mapState = (state) => {
//   return {

//   }
// }

// const mapDispatch = (dispatch) => {
//   return {

//   }
// }

//  export default connect(mapState, mapDispatch)(CalendarBoard)
