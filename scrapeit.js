const request = require('request');
const cheerio = require('cheerio');
const pdc = require('pdc');

const url = "https://web.archive.org/web/20130817032836/http://www.yalewiki.org:80/wiki/Late-night_food";
request(url, function(err, resp, body){
  $ = cheerio.load(body);
  const relevantContent = $('#mw-content-text').outerHTML;
  pdc(relevantContent, 'html', 'mediawiki', function(err, result) {
    console.log(result);
  });
});
