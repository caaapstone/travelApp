import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {auth} from '../store'
import {Parallax} from 'react-parallax'

const formStyles = {background: 'white', padding: 20, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)'};
const image2 = "https://images.unsplash.com/photo-1497302347632-904729bc24aa?ixlib=rb-0.3.5&s=7aedbd8f3945af053ad3f8a03e50b602&auto=format&fit=crop&w=1950&q=80";
const image3 = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=468a8c18f5d811cf03c654b653b5089e&auto=format&fit=crop&w=1350&q=80"
/**
 * COMPONENT
 */
const AuthForm = (props) => {
  const {name, displayName, handleSubmit, error} = props

  return (
    displayName === 'Login' ?
    <Parallax bgImage={image2}
      strength={500}>
    <div style={{height: "100vh"}}>
    <div style={formStyles}>
    <div>
      <form onSubmit={handleSubmit} name={name}>
        <div>
          <label htmlFor="email"><small>Email</small></label>
          <input name="email" type="text" />
        </div>
        <div>
          <label htmlFor="password"><small>Password</small></label>
          <input name="password" type="password" />
        </div>
        <div>
          <button className="button" type="submit">{displayName}</button>
        </div>
        {error && error.response && <div> {error.response.data} </div>}
      </form>
      </div>
      </div>
    </div>
    </Parallax>
    : <div/> &&

    displayName === 'Sign Up' && <Parallax bgImage={image3}
    strength={500}>
  <div style={{height: "100vh"}}>
  <div style={formStyles}>
  <div>
    <form onSubmit={handleSubmit} name={name}>
      <div>
        <label htmlFor="email"><small>Email</small></label>
        <input name="email" type="text" />
      </div>
      <div>
        <label htmlFor="password"><small>Password</small></label>
        <input name="password" type="password" />
      </div>
      <div>
        <button className="button" type="submit">{displayName}</button>
      </div>
      {error && error.response && <div> {error.response.data} </div>}
    </form>
    </div>
    </div>
  </div>
  </Parallax>

  )
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = (state) => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapSignup = (state) => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleSubmit (evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      dispatch(auth(email, password, formName))
    }
  }
}


export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
