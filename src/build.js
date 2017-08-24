'use strict';

const camelize = require('camelize');
const except = require('except');

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
  const imports = markdown.attributes.imports || {};
  const jsx = markdown.html.replace(/class=/g, 'className=');

  const frontMatterAttributes = except(markdown.attributes, 'imports');

  // eslint-disable-next-line no-restricted-syntax
  for (const variable in imports) {
    // eslint-disable-next-line no-prototype-builtins
    if (imports.hasOwnProperty(variable)) {
      doImports += `import ${variable} from '${imports[variable]}';\n`;
    }
  }

  return `
${doImports}
export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = Object.assign({}, this.props, ${JSON.stringify(camelize(frontMatterAttributes))})
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  render () {
    const state = this.state
    const setState = this.setState.bind(this)
    return (
      <div>
        ${jsx}
      </div>
    )
  }
}`;
};
