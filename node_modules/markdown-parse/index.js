var fm = require('front-matter');
var marked = require('marked');
var concat = require('concat-stream')
var through = require('through2')
var duplexer = require('duplexer')

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  langPrefix: ''
})

function parse(string, done){
  var frontmatter = fm(string);
  var matterdata = frontmatter.attributes;

  marked(frontmatter.body, function (err, html){
    if(err) return done(err)

    frontmatter.html = html
    done(null, frontmatter)
  })  
}

module.exports = parse

module.exports.stream = function(){

  var output = through()
  var input = concat(function(input){
    parse(input.toString(), function(err, result){
      if(err){
        console.error(err)
        process.exit(1)
      }
      output.end(JSON.stringify(result))
    })
  })

  return duplexer(input, output)
}