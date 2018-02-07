import React, { Component } from 'react'
import {render} from 'react-dom'

function LandingVideo() {
  return (
    <div>
    <img className="landing-logo-icon" src="/origami-bird.png" />
    <video width="100%" autoPlay loop preload="true" muted>
      <source src="/videos/10K_Feet.mp4" type="video/mp4"/>
    </video>
    </div>
  )
}

export default LandingVideo
