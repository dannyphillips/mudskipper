import * as functions from 'firebase-functions';
const Crawler = require('crawler');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.mudskipper = functions.https.onRequest((request, response) => {
  const c = new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    callback: function (error, res) {
      if(error) {
        console.log(error);
      } else {
        const $ = res.$;
        const rows = $(".table-fishcount")
          .find("tr")
          .not(".catch-row");
        const data =[];
        rows.each(rowIndex => {
          const row = rows[rowIndex];
          const date = $("td", row)
            .first()
            .text();
          const tripType = $(".triptype", row).text();
          const anglers = $(".anglers", row).text();
          const fishCounts = $(".catch", row).children();
          const fish = [];
          fishCounts.each(fishIndex => {
            const fishCount = $(".count", fishCounts[fishIndex]).text();
            const fishType = $(".fishtype", fishCounts[fishIndex]).text();
            fish.push({
              name: fishType,
              count: fishCount
            });
          });
          data.push({
            date: date,
            tripType: tripType,
            anglers: anglers,
            fish: fish
          })
        });
        data.shift();
        response.send(data);
        console.log(data);
      }
    }

  });
  function twoDigits(num) {
    if (num >= 10) {
      return num.toString();
    } else {
      return "0" + num.toString();
    }
  }

  const today = new Date();
  const year = today.getFullYear().toString();
  const month = today.getMonth() + 1;
  const day = today.getDate().toString();
  const dateInt = year + twoDigits(month) + twoDigits(day);

  c.queue(`https://www.fishingreport.us/plugin/page/16/${dateInt}`);
});
