'use strict';

const
  fs = require('fs'),
  path = require('path'),
  parser = require('../src/parser.js');

describe('Parse Markdown', () => {

  let mdExample = '';
  const mdFile = path.join(__dirname, './examples/hello-world.md');

  before(done => {
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
    result.should.have.property('attributes');
    result.should.have.property('body');
  });

  it('front matter attributes should contain imports object', () => {
    const result = parser.parseFrontMatter(mdExample);
    result.attributes.should.have.property('imports');
    result.attributes.imports.should.be.a('object');
    result.attributes.imports.should
      .deep.equal({ Button: './button.js', HelloWorld: './hello-world.js' });
  });

  it('example code blocks have run and source code', () => {
    const
      exampleCode = 'example',
      result = parser.codeBlockTemplate(exampleCode, exampleCode);

    result.should.equal(`
<div class="example">
  <div class="run">example</div>
  <div class="source">
    <pre><code>
      example
    </code></pre>
  </div>
</div>`);
  });

  it('parses markdown with live code blocks', (done) => {
    parser.parse(mdExample).then(result => {
      result.html.should.contain(`<div class="run"><HelloWorld />
<Button label="Hello World" />
</div>`);
    })
    .then(done)
    .catch(done);
  });

  it('parses markdown and created valid html for JSX', (done) => {
    const
      exampleCode = '![](myImage.png)';
    parser.parse(exampleCode).then(result => {
      result.html.should.equal('<p><img src="myImage.png" alt="" /></p>\n');
    })
    .then(done)
    .catch(done);
  });

  it('provides the front-matter attributes', (done) => {
    parser.parse(mdExample).then(result => {
      result.attributes['test-front-matter'].should.equal('hello world');
    })
    .then(done)
    .catch(done);
  });

});
