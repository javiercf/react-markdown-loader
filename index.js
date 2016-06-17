"use strict";

const parser = require('markdown-parse');

/**
 *
 */
 module.exports = function(content) {
  let source = '';
  parser(content, function(err, result) {
    const props = result.attributes.props,
    name = result.attributes.componentName,
    paths = result.attributes.dependencies,
    children = result.attributes.children;

    let imports = '', componentProps = '';
    if (paths) {
      for (const name in paths) {
        imports += `import ${name} from "${paths[name]}"`;
      }
    }

    if (props) {
      componentProps = renderProps(props);
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

    console.log(renderComponent(name, componentProps, children));

  });

  this.cacheable();

  return source;

}

function renderProps(props) {
  let componentProps = '';
  for (const prop in props) {
    componentProps += `${prop}="${props[prop]}" `;
  }
  return componentProps;
}

function renderComponent(name, props, children) {
  if (!children) {
    return `<${name} ${props} />`;
  } else {
    const rendered = children.map(child => {
      const childProps = renderProps(child.props);
      return child.content ? child.content : renderComponent(
          child.name, childProps, child.children)
    });
    return `
    <${name} ${props}>
      ${rendered}
    </${name}>
    `
  }
}
