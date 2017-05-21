React Markdown
==================

[![npm version](https://img.shields.io/npm/v/react-markdown-loader.svg)](https://www.npmjs.com/package/react-markdown-loader)
[![build status](https://travis-ci.org/javiercf/react-markdown-loader.svg?branch=master)](https://travis-ci.org/javiercf/react-markdown-loader)
[![dependencies Status](https://david-dm.org/javiercf/react-markdown-loader/status.svg)](https://david-dm.org/javiercf/react-markdown-loader)
[![devDependencies Status](https://david-dm.org/javiercf/react-markdown-loader/dev-status.svg)](https://david-dm.org/javiercf/react-markdown-loader?type=dev)

Webpack loader that parses markdown files and converts them to a React Stateless Component.
It will also parse FrontMatter to import dependencies and render components
along with it’s source code.

We developed this loader to make the process of creating styleguides for
React components easier.

## Usage

In the FrontMatter you should import the components you want to render
with the component name as a key and it's path as the value

```markdown
---
imports:
  HelloWorld: './hello-world.js',
  '{ Component1, Component2 }': './components.js'
---
```

*webpack.config.js*
```js
module: {
  loaders: [
    {
      test: /\.md$/,
      loader: 'babel!react-markdown'
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
In the markdown File add the *render* tag to code fenceblocks you want the
loader to compile as Components this will output the usual highlighted code
and the rendered component.

*hello-world.md*

<pre>

---
imports:
  HelloWorld: './hello-world.js'
---
# Hello World

This is an example component

```render html
&lt;HelloWorld /&gt;
```

You can send who to say Hello

```render html
&lt;HelloWorld who="World!!!" /&gt;
```

</pre>

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

## Team

[![Javier Cubides](https://avatars.githubusercontent.com/u/3386811?s=130)](https://github.com/javiercf) | [![Fernando Pasik](https://avatars.githubusercontent.com/u/1301335?s=130)](https://fernandopasik.com)
---|---
[Javier Cubides](https://github.com/javiercf) | [Fernando Pasik](https://fernandopasik.com)

## License

MIT (c) 2017
