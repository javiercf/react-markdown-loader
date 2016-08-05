'use strict';

const
  chai = require('chai'),
  dirtyChai = require('dirty-chai');

global.expect = chai.expect;
chai.should();
chai.use(dirtyChai);
