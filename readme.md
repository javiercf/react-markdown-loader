React Markdown
==================

[![npm version](https://img.shields.io/npm/v/react-markdown-loader.svg)](https://www.npmjs.com/package/react-markdown-loader)
[![build status](https://travis-ci.org/javiercf/react-markdown-loader.svg?branch=master)](https://travis-ci.org/javiercf/react-markdown-loader)
[![dependencies Status](https://david-dm.org/javiercf/react-markdown-loader/status.svg)](https://david-dm.org/javiercf/react-markdown-loader)
[![devDependencies Status](https://david-dm.org/javiercf/react-markdown-loader/dev-status.svg)](https://david-dm.org/javiercf/react-markdown-loader?type=dev)

This loader parses markdown files and converts them to a React Stateless Component
It will also parse FrontMatter in order to render components.

## Usage
In order to render components define the following fields in the FrontMatter
spacing in FrontMatter should always be spaces, (tabs produce an error in the compiler)

```markdown
---
ComponentName:
props (optional):
children (optional):
  - foo:
    content: text (When Component children is not a component but text)
    props (optional):
    children (optional):
---
```

*webpack.config.js*
```js
module: {
  loaders: [
    {
      test: /\.md$/,
      loader: 'babel!react-markdown-loader'
    }
  ]
}
```

*hello-world.js*
```js
import React, { PropTypes } from 'react';

/**
 * HelloWorld
 * @param {Object} props React props
 * @returns {JSX} template
 */
export default function HelloWorld(props) {
  return (
    <div className="hello-world">
      Hello { props.who }
    </div>
  );
}

HelloWorld.propTypes = {
  who: PropTypes.string
};

HelloWorld.defaultProps = {
  who: 'World'
};

```

*hello-world.md*
```markdown
---
componentName: HelloWorld
dependencies:
  HelloWorld: ./hello-world.js
props:
  who: World!!!
---
# Hello World

This is an example component

    ```html
    <HelloWorld />
    ```

You can send who to say Hello

    ```html
    <HelloWorld who="World!!!" />
    ```
```
