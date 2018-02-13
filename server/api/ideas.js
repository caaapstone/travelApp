'use strict';

const router = require('express').Router()
const firebaseDb = require('../firebase')
const {Trip} = require('../db/models/')
var request = require("request");
const yelpAPIKey = {"access_token": "fAnTa0ggnBaIHU281A0SmVQzU2X04aRQnso39SkbKZrdK0vOOl_OkDIn0uErj93oe6wvlvagoWxucw8NiUgQdG1icdAxeF0jgKzw__eWkzw6dT1r-0NC4wR7c_7LWXYx",
"expires_in": 640942474,
"token_type": "Bearer"}

module.exports = router

const yelp = require('yelp-fusion');

// Place holder for Yelp Fusion's API Key. Grab them
// from https://www.yelp.com/developers/v3/manage_app
let apiKey = process.env.YELP_API_KEY || 'fAnTa0ggnBaIHU281A0SmVQzU2X04aRQnso39SkbKZrdK0vOOl_OkDIn0uErj93oe6wvlvagoWxucw8NiUgQdG1icdAxeF0jgKzw__eWkzw6dT1r-0NC4wR7c_7LWXYx';

const client = yelp.client(apiKey);

router.get('/trip/:tripId', (req, res, next) => {
  var searchRequest = {
    term: req.query.term,
    location: req.query.location
  }
  client.search(searchRequest).then(response => {
    res.json(response.jsonBody.businesses)
  }).catch(err => {
    console.error(err);
  })
})

router.get('/topactivities', (req, res, next) => {
  client.search({location: req.query.city, sort_by: 'rating', limit: 5})
    .then(response => {
      res.json(response.jsonBody.businesses)
    })
    .catch(err => console.error(err))
})
