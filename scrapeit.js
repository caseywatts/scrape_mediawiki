const request = require('request');
const cheerio = require('cheerio');
const pdc = require('pdc');
const fs = require('fs');
const ncp = require("copy-paste");

// https://web.archive.org/web/20130817032836/http://www.yalewiki.org:80/wiki/Late-night_food
// const url = "https://web.archive.org/web/20130817032836/http://www.yalewiki.org:80/wiki/Late-night_food";

function grabAndTransform(url) {
  request(url, function(err, resp, body){
    $ = cheerio.load(body);
    $('#toc').remove();
    const relevantContent = $('#mw-content-text').html();
    return pdc(relevantContent, 'html', 'mediawiki', function(err, result) {
      const removeTags = /<\/?[^>]+(>|$)/g;
      const removeAbsoluteUrlRoot = /https:\/\/web.archive.org\/web\/\d*\//g;
      const removeRelativeUrlRoot = /web\/\d*\//g;
      const removePortAndWiki = /\:80\/wiki/g;

      result = result.replace(removeTags, '');
      result = result.replace(removeAbsoluteUrlRoot, '');
      result = result.replace(removeRelativeUrlRoot, '');
      result = result.replace(removePortAndWiki, '');

      // fs.writeFile("output.mw", result);
      // console.log(`outputted ${'output.mw'}`);

      ncp.copy(result, function() {
        console.log('copied into clipboard');
      });
    });
  });
}

// "main"
ncp.paste((err, url) => {
  console.log(url);
  grabAndTransform(url);
});
