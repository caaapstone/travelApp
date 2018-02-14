import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter, NavLink, Link} from 'react-router-dom'
import {logout, postTrip, auth} from '../store'
import history from '../history'

 export class Main extends Component {
  submitTrip = (event) =>{
    event.preventDefault()
    const userId = this.props.user.id
    this.props.createTrip(userId)
  }
  componentDidMount() {
    let index = 0;
    const colors = ['#B9CDDA', '#7E4E60']
    let buttonNode = document.getElementById('demo-button')
    setInterval(function () {
      buttonNode.style.backgroundColor = colors[index]
      if(!colors[index]) {
        index = 0
      } else {
        index ++
      }
  }, 1100)
  }

  render(){

  const {children, handleClick, isLoggedIn, logInDemoUser} = this.props

  return (
    <div>
      <div id="nav-bar">
        <Link to="/home">
          <div className="flex-display">
            <img src="/origami-bird-white.png" id="logo"/>
            <h2 className="flock-blue" id="flock-name">flock</h2>
          </div>
        </Link>
        <nav className="vertical-align-center">
          {
            isLoggedIn
              ? <div>
                {/* The navbar will show these links after you log in */}
                <NavLink to="/home" className="nav-links">Dashboard</NavLink>
                <a href="#" onClick={handleClick} className="nav-links">Logout</a>
              </div>
              : <div>
                {/* The navbar will show these links before you log in */}
                <NavLink to="/login" className="nav-links">Login</NavLink>
                <NavLink to="/signup" className="nav-links">Sign Up</NavLink>
                <button id="demo-button" onClick={() => logInDemoUser('demo@flock.com', '123', 'login')}>Start a Demo!</button>
              </div>
          }
        </nav>
      </div>
      {children}
    </div>
  )
}
}

const mapState = (state) => {
  return {
    isLoggedIn: !!state.user.id,
    user: state.user
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleClick () {
      dispatch(logout())
    },
    createTrip: (userId, trip) => {
      return dispatch(postTrip(userId, trip))
      .then(trip =>{
        let tripId = trip.trip.id
        history.push(`/trips/tripdetails/${tripId}`)
      })
    },
    logInDemoUser(email, password, name) {
      dispatch(auth(email, password, name))
      history.push('/home')
    },
  }
}

export default withRouter(connect(mapState, mapDispatch)(Main))

Main.propTypes = {
  children: PropTypes.object,
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
