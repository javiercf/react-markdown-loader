markdown-parse
==============

convert a markdown file into HTML and extract YAML front matter

## installation

```
$ npm install markdown-parse
```

## usage

From a markdown file like this:

```markdown
---
apples: hello
list:
  - 5
  - 10
map:
  apple: 1
  orange: 2
---

hello world

 * list 1
 * list 2

```

You can process it:

```js
var parser = require('markdown-parse');

var content = fs.readFileSync(__dirname + '/testpage.md', 'utf8')	

parser(content, function(err, result){

	console.log('the original body:')
	console.log(result.body)

	console.log('the html:')
	console.log(result.html)

	console.log('the front matter:')
	console.dir(result.attributes)
})
```

## api

### `parser(text, callback(err, result){})`

Process a markdown string that has optional front-matter

The result has the following attributes:

 * body - the original markdown body
 * html - the converted HTML body
 * attributes - the front-matter properties

## cli

The cli interface can be used if you install markdown-parse globally.

```
$ npm install markdown-parse -g
```

```
usage: markdown-parse [options]

options:

  --input, -i - a path to a file to use as input (stdin is default)
  --output, -o - a path to a file to write the output (stdout is default)
```

An example of piping a markdown through the converter into a .json file

```
$ cat mypage.md | markdown-parse > mypage.json
```

### license

MIT