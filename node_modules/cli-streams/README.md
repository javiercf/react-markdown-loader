cli-streams
===========

A pair of streams - process.stdin/stdout or filestreams depending on cli option overrides

## installation

```
$ npm install cli-streams
```

## usage

A module to use when a cli program will accept stdin and write to stdout but can optionally redirect either to a filestream.

```js
var args = require('minimist').parse(process.argv, {
	i:'input',
  o:'output'
})
var resolve = require('cli-path-resolve')
var clistreams = require('cli-streams')
var through = require('through2')

var streams = clistreams(resolve(args.input), resolve(args.output))

streams.input.pipe(through(function(chunk, enc, next){
	this.push(chunk.toString().toUpperCase())
})).pipe(streams.output)
```

## api

### `var pair = streams(inputPath, outputPath)`

return an object with 2 streams:

 * input - either process.stdin or a file readStream if input param exists
 * output - either process.stdout or a file readStream if input param exists

### license

MIT