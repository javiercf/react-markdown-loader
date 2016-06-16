var tape = require('tape')
var resolve = require('./')

tape('test against a relative path', function(t){
	var resolved = resolve('package.json')

	t.equal(resolved, __dirname + '/package.json')
	t.end()
})


tape('return null for a null input', function(t){
	var resolved = resolve()

	t.equal(resolved, null, 'resolved is null')
	t.end()
})
