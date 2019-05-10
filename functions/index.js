const functions = require('firebase-functions');
const Crawler = require("crawler");
const { ciscoCrawler, url } = require("./ciscoCrawler");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.mudskipper = functions.https.onRequest((request, response) => {
  const c = new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    callback: ciscoCrawler
  });

  c.queue(url);
});
