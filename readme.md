React Markdown
==================

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
