const request = require('request');
const cheerio = require('cheerio');
const pdc = require('pdc');
const fs = require('fs');
const ncp = require("copy-paste");
const say = require('say');

// https://web.archive.org/web/20130817032836/http://www.yalewiki.org:80/wiki/Late-night_food
// const url = "https://web.archive.org/web/20130817032836/http://www.yalewiki.org:80/wiki/Late-night_food";

// from https://stackoverflow.com/questions/1701898/how-to-detect-whether-a-string-is-in-url-format-using-javascript
function isURL(s) {
   var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
   return regexp.test(s);
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
        say.speak('ready');
      });
    });
  });
}

// "main"
ncp.paste((err, url) => {
  console.log(url);
  grabAndTransform(url);
});
