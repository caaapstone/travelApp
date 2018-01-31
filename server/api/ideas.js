'use strict';

const router = require('express').Router()
const firebaseDb = require('../firebase')
const {Trip} = require('../db/models/')
var request = require("request");

module.exports = router

const yelp = require('yelp-fusion');

// Place holder for Yelp Fusion's API Key. Grab them
// from https://www.yelp.com/developers/v3/manage_app
let apiKey = '8z4I_13yqULHbTtL6mNePY_2n2r57MNfYDsdlQhdXBynqKxMn_E5ayFiSsh4VHF0YQaWWAi2wB1Xi01PBuc9jEX3nTHAg0Yl16kVXw0C6bxORko0RQV-cyB5xRNqWnYx';

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
