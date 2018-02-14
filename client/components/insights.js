import React from 'react';
import * as d3 from "d3";
import axios from 'axios'
import Stats from './stats'

export default class BasicPieChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true
    };
  }

  componentDidMount() {
    axios.get('/api/trips/')
      .then((results) => {
        let cities = {}
        let data = []
        let trips = results.data.filter(trip => trip.destinationCity !== null)
        for (var i = 0; i<trips.length; i++){
          if (cities[trips[i].destinationCity] === undefined) {
            cities[trips[i].destinationCity] = 1
          } else {
            cities[trips[i].destinationCity] = cities[trips[i].destinationCity] + 1
          }
        }
        for(var key in cities) {
          data.push({
            city: key,
            count: cities[key]
          })
        }
        this.setState({data: data.slice(0, 10), loading: false})
      })
  }

  render() {
    return (
      this.state.loading
        ? <div />
        : <div className="small-no-margin">
          <Stats data={this.state.data} />
        </div>
    );
  }
}
