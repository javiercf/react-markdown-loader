'use strict';

const
  frontMatter = require('front-matter'),
  highlight = require('highlight.js'),
  Remarkable = require('remarkable'),
  escapeHtml = require('remarkable/lib/common/utils').escapeHtml,
  md = new Remarkable();

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
  let codeBlock = escapeHtml(code);

  if (highlight) {
    codeBlock = highlight(code, lang);
  }

  const
    langClass = !lang ? '' : `${langPrefix}${escape(lang, true)}`,
    jsx = code;

  codeBlock = codeBlock
    .replace(/(\n)/g, '{"\\n"}')
    .replace(/class=/g, 'className=');

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
    let html;

    const options = {
      highlight(code) {
        return highlight.highlightAuto(code).value;
      },
      xhtmlOut: true
    };

    md.set(options);

    md.renderer.rules.fence_custom.render = (tokens, idx, options) => {
      // gets tags applied to fence blocks ```react html
      const codeTags = tokens[idx].params.split(/\s+/g);
      return parseCodeBlock(
        tokens[idx].content,
        codeTags[codeTags.length - 1],
        options.langPrefix,
        options.highlight
      );
    };

    try {
      html = md.render(markdown.body);
      resolve({ html, imports: markdown.attributes.imports });
    } catch (err) {
      return reject(err);
    }

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
