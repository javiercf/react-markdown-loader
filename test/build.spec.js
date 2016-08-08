'use strict';

const
  fs = require('fs'),
  path = require('path'),
  build = require('../src/build.js'),
  parser = require('../src/parser.js');

describe('Build Component', () => {

  let component = '';
  const mdFile = path.join(__dirname, './examples/hello-world.md');

  before(done => {
    fs.readFile(mdFile, 'utf8', (err, data) => {
      if (err) {
        return done(err);
      }

      parser
        .parse(data)
        .then(html => {
          component = build(html);
          done();
        })
        .catch(done);
    });
  });

  it('add React import', () => {
    component.should.contain('import React from \'react\';\n');
  });

  it('add component imports', () => {
    component.should.contain('import Button from \'./button.js\';\n');
    component.should.contain('import HelloWorld from \'./hello-world.js\';\n');
  });

});
