var tape = require('tape')
var parser = require('./')
var fs = require('fs')
var concat = require('concat-stream')

tape('process the test file', function(t){
	var content = fs.readFileSync(__dirname + '/testpage.md', 'utf8')	

	parser(content, function(err, result){
		if(err){
			t.fail(err, 'process result')
			t.end()
			return
		}

		t.equal(result.attributes.apples, 'hello', 'apples')
		t.deepEqual(result.attributes.list, [5, 10], 'list')
		t.deepEqual(result.attributes.map, {apple:1,orange:2}, 'map')

		t.equal(result.body, '\nhello world\n\n```\nsome code\n```\n\n * list 1\n * list 2', 'body')
		t.equal(result.html, '<p>hello world</p>\n<pre><code>some code\n</code></pre><ul>\n<li>list 1</li>\n<li>list 2</li>\n</ul>\n', 'html')

		t.end()
	})


	
})


tape('process the simple file', function(t){
	var content = fs.readFileSync(__dirname + '/plaintest.md', 'utf8')	

	parser(content, function(err, result){
		if(err){
			t.fail(err, 'process result')
			t.end()
			return
		}

		t.equal(Object.keys(result.attributes).length, 0, 'no attributes but is defined')
		t.end()
	})


	
})


tape('process using the stream method', function(t){

	var file = fs.createReadStream(__dirname + '/plaintest.md', 'utf8')
	var p = parser.stream()

	file.pipe(p).pipe(concat(function(output){
		output = JSON.parse(output.toString())
		t.ok(output.html.indexOf('<p>hello world</p>')==0, 'the output is correct')
		t.end()
	}))
	
})