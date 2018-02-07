'use strict';

const router = require('express').Router()
const firebaseDb = require('../firebase')
const {Trip} = require('../db/models/')
var request = require("request");

module.exports = router

const yelp = require('yelp-fusion');

// Place holder for Yelp Fusion's API Key. Grab them
// from https://www.yelp.com/developers/v3/manage_app
let apiKey = process.env.YELP_API_KEY;

const client = yelp.client(apiKey);

router.get('/trip/:tripId', (req, res, next) => {
  var searchRequest = {
    term: req.query.term,
    location: req.query.location
  }
  client.search(searchRequest).then(response => {
    res.json(response.jsonBody.businesses)
  }).catch(e => {
    console.log(e);
  })
})

router.get('/topactivities', (req, res, next) => {
  client.search({location: req.query.city, sort_by: 'rating', limit: 5})
    .then(response => {
      res.json(response.jsonBody.businesses)
    })
    .catch(e => console.log(e))
})
