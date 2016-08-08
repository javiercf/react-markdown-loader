'use strict';

const
  frontMatter = require('front-matter'),
  highlight = require('highlight.js'),
  marked = require('marked'),
  renderer = new marked.Renderer();

/**
 * Wraps the code and jsx in an html component
 * for styling it later
 * @param   {string} exampleRun Code to be run in the styleguide
 * @param   {string} exampleSrc Source that will be shown as example
 * @param   {string} langClass  CSS class for the code block
 * @returns {string}            Code block with souce and run code
 */
function codeBlockTemplate(exampleRun, exampleSrc, langClass) {
  return `
<div class="example">
  <div class="run">${exampleRun}</div>
  <div class="source">
    <pre><code${!langClass ? '' : ` class="${langClass}"`}>
      ${exampleSrc}
    </code></pre>
  </div>
</div>`;
}

/**
 * Parse a code block to have a source and a run code
 * @param   {String}   code       - Raw html code
 * @param   {String}   lang       - Language indicated in the code block
 * @param   {String}   langPrefix - Language prefix
 * @param   {Function} highlight  - Code highlight function
 * @returns {String}                Code block with souce and run code
 */
function parseCodeBlock(code, lang, langPrefix, highlight) {
  let codeBlock = code;

  if (highlight) {
    codeBlock = highlight(code, lang);
  }

  const
    langClass = !lang ? '' : `${langPrefix}${escape(lang, true)}`,
    jsx = code;

  codeBlock = codeBlock
    .replace(/{/g, '{"{"{')
    .replace(/}/g, '{"}"}')
    .replace(/{"{"{/g, '{"{"}')
    .replace(/class=/g, 'className=')
    .replace(/(\n)/g, '{"\\n"}');

  return codeBlockTemplate(jsx, codeBlock, langClass);
}

/**
 * @typedef MarkdownObject
 * @type {Object}
 * @property {Object} attributes - Map of properties from the front matter
 * @property {String} body       - Markdown
 */

/**
 * @typedef HTMLObject
 * @type {Object}
 * @property {String} html    - HTML parsed from markdown
 * @property {Object} imports - Map of dependencies
 */

/**
 * Parse Markdown to HTML with code blocks
 * @param   {MarkdownObject} markdown - Markdown attributes and body
 * @returns {HTMLObject}                HTML and imports
 */
function parseMarkdown(markdown) {
  return new Promise((resolve, reject) => {

    const options = {
      renderer,
      highlight(code) {
        return highlight.highlightAuto(code).value;
      }
    };

    renderer.code = function (code, lang) {
      return parseCodeBlock(code, lang,
        this.options.langPrefix, this.options.highlight);
    };

    marked(markdown.body, options, (err, html) => {
      // istanbul ignore if
      if (err) {
        return reject(err);
      }

      resolve({ html, imports: markdown.attributes.imports });
    });

  });
}

/**
 * Extract FrontMatter from markdown
 * and return a separate object with keys
 * and a markdown body
 * @param   {String} markdown - Markdown string to be parsed
 * @returns {MarkdownObject}    Markdown attributes and body
 */
function parseFrontMatter(markdown) {
  return frontMatter(markdown);
}

/**
 * Parse markdown, extract the front matter
 * and return the body and imports
 * @param  {String} markdown - Markdown string to be parsed
 * @returns {HTMLObject}       HTML and imports
 */
function parse(markdown) {
  return parseMarkdown(parseFrontMatter(markdown));
}

module.exports = {
  codeBlockTemplate,
  parse,
  parseCodeBlock,
  parseFrontMatter,
  parseMarkdown
};
