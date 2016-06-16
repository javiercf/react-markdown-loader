"use strict";

const parser = require('markdown-parse');

/**
 *
 */
module.exports = function(content) {
  let source = '';
  parser(content, function(err, result) {
    const props = result.attributes.props,
      paths = result.attributes.dependencies;

    let imports = '', componentProps = '';
    if (paths) {
      for (const name in paths) {
        imports += `import ${name} from "${paths[name]}"`;
      }
    }

    if (props) {
      for (const prop in props) {
        componentProps += `${prop}="${props[prop]}" `;
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
              <${result.attributes.componentName} ${componentProps} />
            </div>
          );
        }).apply(context);
      };
    `;

  });

  return source;

}