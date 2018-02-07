import React, { Component } from 'react'
import LandingVideo from './landingVideo.js'
import {Parallax} from 'react-parallax'
import {Login, Signup} from './index'
import {NavLink} from 'react-router-dom'


const formStyles = {background: 'white', padding: 20, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)'};
const textStyles = {background: 'none', padding: 20, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)'};
const image1 = "https://images.unsplash.com/photo-1493558103817-58b2924bce98?ixlib=rb-0.3.5&s=8fd653be5cbabd5193c4012fa3c6947b&auto=format&fit=crop&w=1768&q=80";
const image2 = "https://images.unsplash.com/photo-1497302347632-904729bc24aa?ixlib=rb-0.3.5&s=7aedbd8f3945af053ad3f8a03e50b602&auto=format&fit=crop&w=1950&q=80";

let LandingPage = () => {

  return (
    <div className="landing-container">
    <div className="landing-video">
    <LandingVideo />
    </div>
    <div className="parallax-container">
    <Parallax bgImage={image1}
      strength={500}>
      <div style={{height: "100vh"}}>
        <div style={textStyles}>
        <h1 className="landing-header">Plan the ultimate group vacation with flock.</h1>
        </div>
      </div>
    </Parallax>
    </div>
    </div>
  )
}

export default LandingPage
