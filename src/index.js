'use strict';

const
  build = require('./build.js'),
  parser = require('./parser.js');

/**
 * Main function
 * @param   {String}  content   Markdown file content
 */
module.exports = function (content) {

  const callback = this.async();

  parser
    .parse(content)
    .then(build)
    .then(component => callback(null, component))
    .catch(callback);

};
