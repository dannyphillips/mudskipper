const Crawler = require("crawler");

const c = new Crawler({
  maxConnections: 10,
  // This will be called for each crawled page
  callback: function(error, res) {
    if (error) {
      console.log(error);
    } else {
      const $ = res.$;
      const rows = $(".table-fishcount")
        .find("tr")
        .not(".catch-row");
      const headings = rows[0];
      let data = [];
      rows.each(rowIndex => {
        const row = rows[rowIndex];
        const date = $("td", row)
          .first()
          .text();
        const tripType = $(".triptype", row).text();
        const anglers = $(".anglers", row).text();
        const fishCounts = $(".catch", row).children();
        let fish = [];
        fishCounts.each(fishIndex => {
          let fishCount = $(".count", fishCounts[fishIndex]).text();
          let fishType = $(".fishtype", fishCounts[fishIndex]).text();
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

var today = new Date();

var year = today.getFullYear().toString();
var month = today.getMonth() + 1;
var day = today.getDate().toString();

dateInt = year + twoDigits(month) + twoDigits(day);

c.queue(`https://www.fishingreport.us/plugin/page/16/${dateInt}`);
