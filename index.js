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
    const props = result.attributes.props,
      name = result.attributes.componentName,
      paths = result.attributes.dependencies,
      children = result.attributes.children,
      componentProps = renderProps(props);

    let imports = '';
    if (paths) {
      for (name in paths) {
        if ({}.hasOwnProperty.call(paths, name)) {
          imports += `import ${name} from "${paths[name]}"`;
        }
      }
    }

    source = `
    ${imports}

    module.exports = function(context) {
      return (function() {
        if (!React) {
          var React = require("react");
        }


        return (
        <div>
        ${result.html}
        ${name ? renderComponent(name, componentProps, children) : ''}
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
    for (prop in props) {
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
