#!/usr/bin/env node
var args = require('minimist')(process.argv, {
  alias:{
    i:'input',
    o:'output'
  },
  default:{
    
  }
})

var path = require('path')
var fs = require('fs')
var resolve = require('cli-path-resolve')
var clistreams = require('cli-streams')
var parser = require('./index')

var streams = clistreams(resolve(args.input), resolve(args.output))

streams.input.pipe(parser.stream()).pipe(streams.output)