var tape = require('tape')
var clistreams = require('./')
var fs = require('fs')
var cp = require('child_process')

tape('test a filepipe', function(t){

	var streams = clistreams(__dirname + '/package.json', __dirname + '/package.out.json')

	streams.output.on('close', function(){
		var packageorig = require(__dirname + '/package.json')
		var packageout = require(__dirname + '/package.out.json')

		t.deepEqual(packageorig, packageout, 'the files are the same')
		fs.unlinkSync(__dirname + '/package.out.json')
		t.end()
	})

	streams.input.pipe(streams.output)
})


tape('test a stdin / stdout pipe', function(t){

	var proc = cp.spawn('node', [
		__dirname + '/testscript.js',
		'--output',
		'testout.txt'
	], {
		stdio:'pipe'
	})

	proc.on('close', function(){
		var contents = fs.readFileSync(__dirname + '/testout.txt', 'utf8')
		t.equal(contents, 'HELLO WORLD', 'the text is the same')
		t.end()
	})

	proc.stderr.pipe(process.stderr)
	proc.stdout.pipe(process.stdout)
	proc.stdin.end('hello world')
})
