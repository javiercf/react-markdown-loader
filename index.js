'use strict';

const parser = require('markdown-parse');

/**
 * Main function
 * @param {String} content
 * @returns {String}
 */
module.exports = function (content) {
  let source = '';
  parser(content, (err, result) => {
    const re = /<code[^>]*>([\S\s].+?)[\S\s]<\/code>/g,
      paths = result.attributes.dependencies;
    let example,
      imports = 'import React from "react";';

    result.html = result.html.replace(re, (codeElement, code) => {
      example = code
        .replace(/&lt;/g, '<')
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, '>');
      return `
      <div class="example">
        <div class="example-run">${example}</div>
        ${codeElement}
      </div>`;
    });

    if (paths) {
      for (const name in paths) {
        if ({}.hasOwnProperty.call(paths, name)) {
          imports += `import ${name} from "${paths[name]}";`;
        }
      }
    }

    source = `
    ${imports}

    module.exports = function(context) {
      return (function() {
        return (
        <div>
        ${result.html}
        </div>
        );
      }).apply(context);
    };
    `;

  });

  this.cacheable();

  return source;

};
