'use strict';

const fs = require('fs');
const path = require('path');
const parser = require('../src/parser.js');

describe('Parse Markdown', () => {
  let mdExample = '';
  const mdFile = path.join(__dirname, './examples/hello-world.md');

  beforeAll((done) => {
    fs.readFile(mdFile, 'utf8', (err, data) => {
      if (err) {
        return done(err);
      }

      mdExample = data;
      done();
    });
  });

  it('extracts front matter from markdown', () => {
    const result = parser.parseFrontMatter(mdExample);
    expect(result).toHaveProperty('attributes');
    expect(result).toHaveProperty('body');
  });

  it('front matter attributes should contain imports object', () => {
    const result = parser.parseFrontMatter(mdExample);
    expect(result.attributes).toHaveProperty('imports');
    expect(result.attributes.imports).toBeInstanceOf(Object);
    expect(result.attributes.imports).toEqual({ Button: './button.js', HelloWorld: './hello-world.js' });
  });

  it('example code blocks have run and source code', () => {
    const exampleCode = 'example';
    const result = parser.codeBlockTemplate(exampleCode, exampleCode);

    expect(result).toEqual(`
<div class="example">
  <div class="run">example</div>
  <div class="source">
    <pre><code>
      example
    </code></pre>
  </div>
</div>`);
  });

  it('parses markdown with live code blocks', () =>
    parser.parse(mdExample).then((result) => {
      expect(result.html).toMatch(/<div class="run"><HelloWorld \/>\s*<Button label="Hello World" \/>\s*<\/div>/);
    }),
  );

  it('parses markdown and created valid html for JSX', () =>
    parser.parse('![](myImage.png)').then((result) => {
      expect(result.html).toMatch(/<p><img src="myImage.png" alt="" \/><\/p>\n/);
    }),
  );

  it('provides the front-matter attributes', () =>
    parser.parse(mdExample).then((result) => {
      expect(result.attributes).toHaveProperty('test-front-matter', 'hello world');
    }),
  );
});
