import React from 'react';
import * as d3 from "d3";
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {fetchTopCityActivities} from '../store'

class BasicPieChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    const width = 600,
      height = 313,
      outerRadius = height / 2 - 20,
      innerRadius = outerRadius / 3,
      cornerRadius = 10;

    const radius = Math.min(width, height) / 2,
          labelRadius = radius - 10;

    const colors = ['#56e2cf', '#56aee2', '#5568e2', '#8a55e2', '#cf56e2', '#e256ae', '#e25668', '#e28956', '#e2d055', '#aee255', '#68e256', '#56e289'];

    const chart = d3.select(this.chartRef)
      .attr("width", 650)
      .attr("height", 350)
      .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    //Center label
    chart
      .append('text')
        .attr("text-anchor", "middle")
        .attr('dy', '0.35em')
        .style('font-size', '24px')
        .text('');

    const pie = d3.pie()
      .sort(null)
      .value((d) => +d.count)
      .padAngle(.02);

    const arc = d3.arc()
      .outerRadius(outerRadius - 20)
      .innerRadius(innerRadius);

    const arcsWithData = pie(this.props.data);

    const gContainer = chart.selectAll("path")
      .data(arcsWithData)
      .enter()
        .append('g');

    gContainer
      .append("path")
        .attr("fill", (d, i) => colors[i])
        .attr("d", arc);

    //Add outside labels
    gContainer
      .append('text')
      .attr("transform", (d) => {
        const c = arc.centroid(d);
        const x = c[0];
        const y = c[1];
        const h = Math.sqrt(x*x + y*y);
        return `translate(${x/h * labelRadius},${y/h * labelRadius})`;
      })
      .attr("text-anchor", (d) => {
        // did we past the center?
        return (d.endAngle + d.startAngle) / 2 > Math.PI ? "end" : "start";
      })
      .attr("dy", ".35em")
      .text((d) => {
        return `${d.data.city}`;
      })
      .attr('class', 'topLabel')
      .on("click", (d) => {this.props.getTopActivities(d.data.city)});
  }

  render() {
    return (
      <svg className="pie-chart--basic" ref={(r) => this.chartRef = r}></svg>
    );
  }
}

let mapState

const mapDispatch = (dispatch) => {
  return {
    getTopActivities(city) {
      dispatch(fetchTopCityActivities(city))
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(BasicPieChart))
