const request = require('request');
const cheerio = require('cheerio');
const pdc = require('pdc');
const fs = require('fs');
const ncp = require("copy-paste");

// https://web.archive.org/web/20130817032836/http://www.yalewiki.org:80/wiki/Late-night_food
// const url = "https://web.archive.org/web/20130817032836/http://www.yalewiki.org:80/wiki/Late-night_food";

// from https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
function isURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(str);
}

function grabAndTransform(url) {
  if (!isURL(url)) {
    console.log(`the clipboard currently contains ${url}`);
    console.log('this is not a valid url');
    return;
  }
  request(url, function(err, resp, body){
    $ = cheerio.load(body);
    $('#toc').remove();
    const relevantContent = $('#mw-content-text').html();
    return pdc(relevantContent, 'html', 'mediawiki', function(err, result) {
      const removeTags = /<\/?[^>]+(>|$)/g;
      const removeAbsoluteUrlRoot = /https:\/\/web.archive.org\/web\/\d*\//g;
      const removeRelativeUrlRoot = /web\/\d*\//g;
      const removePortAndWiki = /\:80\/wiki/g;
      const removeSideBar = /{\|[\s\S]*?\|}/g;

      result = result.replace(removeTags, '');
      result = result.replace(removeAbsoluteUrlRoot, '');
      result = result.replace(removeRelativeUrlRoot, '');
      result = result.replace(removePortAndWiki, '');
      result = result.replace(removeSideBar, '');
      result = `{{plshelp}}\n\n${result}`;

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
