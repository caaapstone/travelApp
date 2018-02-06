import React, { Component } from 'react'
import {render} from 'react-dom'

function LandingVideo() {
  return (
    <div className="landing-vid-container">
    <div className="landing-logo">
      <img className="landing-logo-icon" src="/origami-bird.png" />
      <h1 className="landing-logo-text">flock</h1>
    </div>
    <div className="landing-vid">
    <video width="100%" autoPlay loop preload="true" muted>
      <source src="/videos/10K_Feet.mp4" type="video/mp4"/>
    </video>
    </div>
    </div>
  )
}

export default LandingVideo
