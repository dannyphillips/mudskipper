var Crawler = require("crawler");

var c = new Crawler({
  maxConnections: 10,
  // This will be called for each crawled page
  callback: function(error, res, done) {
    if (error) {
      console.log(error);
    } else {
      var $ = res.$;
      var rows = $(".table-fishcount")
        .find("tr")
        .not(".catch-row");
      var headings = rows[0];
      // rows = rows.shift();
      var data = [];
      // console.log(rows);
      rows.each(rowIndex => {
        var row = rows[rowIndex];
        var date = $("td", row)
          .first()
          .text();
        var tripType = $(".triptype", row).text();
        var anglers = $(".anglers", row).text();
        var fishCounts = $(".catch", row).children();
        var fish = [];
        fishCounts.each(fishIndex => {
          var fishType = "";
          var fishCount = 0;
          fishCount = $(".count", fishCounts[fishIndex]).text();
          fishType = $(".fishtype", fishCounts[fishIndex]).text();
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
    done();
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

// c.queue(`https://www.fishingreport.us/plugin/page/16/${dateInt}`);
c.queue(`https://www.fishingreport.us/plugin/page/16/20151031`);
