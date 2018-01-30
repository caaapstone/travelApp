'use strict';

const router = require('express').Router()
const firebaseDb = require('../firebase')

module.exports = router
const yelp = require('yelp-fusion');

// Place holder for Yelp Fusion's API Key. Grab them
// from https://www.yelp.com/developers/v3/manage_app
const apiKey = '8z4I_13yqULHbTtL6mNePY_2n2r57MNfYDsdlQhdXBynqKxMn_E5ayFiSsh4VHF0YQaWWAi2wB1Xi01PBuc9jEX3nTHAg0Yl16kVXw0C6bxORko0RQV-cyB5xRNqWnYx';

const searchRequest = {
  term:'hotel',
  location: 'san francisco, ca'
};

const client = yelp.client(apiKey);

// client.search(searchRequest).then(response => {
//   const firstResult = response.jsonBody.businesses[0];
//   const prettyJson = JSON.stringify(firstResult, null, 4);
//   console.log(prettyJson);
// }).catch(e => {
//   console.log(e);
// });
//get destination city and state from trip model for searchRequest

router.get('/', (req, res, next) => {
  client.search(searchRequest).then(response => {
    const results = response.jsonBody.businesses;
    const prettyJson = JSON.stringify(results, null, 4);
    console.log(prettyJson);
  }).catch(e => {
    console.log(e);
  });
})

