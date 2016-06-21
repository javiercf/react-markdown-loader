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
    const re = /<code[^>]*>([\S\s].+?)[\S\s]<\/code>/g;
    let m;

    while ((m = re.exec(result.html)) !== null) {
      let tag = '';
      if (m.index === re.lastIndex) {
        re.lastIndex++;
      }
      tag = m[1].replace(/&lt;/g, '<');
      tag = tag.replace(/&quot;/g, '"');
      tag = tag.replace(/&gt;/g, '>');
      result.html = insert(result.html, m[0].length + m.index, tag);
    }

    const props = result.attributes.props,
      name = result.attributes.componentName,
      paths = result.attributes.dependencies,
      children = result.attributes.children,
      componentProps = renderProps(props);

    let imports = 'import React from "react";';
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

/**
 * @param {Object} props Component props
 * @returns {String}
 */
function renderProps(props) {
  let componentProps = '';
  if (props) {
    for (const prop in props) {
      if ({}.hasOwnProperty.call(props, prop)) {
        componentProps += `${prop}="${props[prop]}" `;
      }
    }
  }
  return componentProps;
}

/**
 * @param {String} name Component Name
 * @param {String} props Component props String
 * @param {Array} children Component children array
 * @returns {String}
 */
function renderComponent(name, props, children) {
  let component = '';
  if (!children) {
    component = `<${name} ${props} />`;
  } else {
    const rendered = children.map(child => {
      const childProps = renderProps(child.props);
      return child.content ? child.content : renderComponent(
        child.name, childProps, child.children);
    });
    component = `<${name} ${props}>${rendered}</${name}>`;
  }

  return component;
}

function insert(str, index, value) {
  return str.substr(0, index) + value + str.substr(index);
}
