'use strict';

const fs = require('fs');
const path = require('path');
const loader = require('../src/index.js');

describe('React Markdown Loader', () => {
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

  it('converts markdown to component', (done) => {
    // eslint-disable-next-line prefer-reflect
    loader.call({
      async: (err) => {
        expect(err).not.toBeDefined();
        done();
      },
    }, mdExample);
  });
});
