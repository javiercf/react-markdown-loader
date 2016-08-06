'use strict';

/**
 * @typedef HTMLObject
 * @type {Object}
 * @property {String} html    - HTML parsed from markdown
 * @property {Object} imports - Map of dependencies
 */

/**
 * Builds the React Component from markdown content
 * with its dependencies
 * @param   {HTMLObject} markdown - HTML and imports
 * @returns {String}              - React Component
 */
module.exports = function build(markdown) {

  let doImports = 'import React from \'react\';\n';
  const
    imports = markdown.imports || {},
    jsx = markdown.html.replace(/class=/g, 'className=');

  for (const variable in imports) {
    // eslint-disable-next-line no-prototype-builtins
    if (imports.hasOwnProperty(variable)) {
      doImports += `import ${variable} from '${imports[variable]}';\n`;
    }
  }

  return `
${doImports}

module.exports = function() {
  return (
    <div>
      ${jsx}
    </div>
  );
};`;
};
