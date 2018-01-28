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
      // update state, dispatch put here
      // el is the thing you're moving
      // target is where you're putting it
    })
  }

  render () {
    console.log('this.state.drake: ', this.state.drake)
    return (
      <div>
      <div id='container1' ref={this.dragulaDecorator} title='Monday'>
        <div>Swap her around</div>
        <div>Swap him around</div>
        <div>Swap them around</div>
        <div>Swap us around</div>
        <div>Swap things around</div>
        <div>Swap everything around</div>
      </div>
      <br />
      <br />
      <div id='container2' ref={this.dragulaDecorator} title='Tuesday'>
        <div>Swap us around</div>
        <div>Swap you around</div>
        <div>Swap EVERYONE around</div>
        <div>Swap them around</div>
        <div>Swap ALL THE THINGS around</div>
        <div>Swap things around</div>
        <div>Swap everything around</div>
      </div>
      </div>
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

// export default connect(mapState, mapDispatch)(CalendarBoard)

