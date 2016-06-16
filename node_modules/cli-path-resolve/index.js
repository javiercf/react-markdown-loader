var path = require('path')

module.exports = function(filepath){
	if(!filepath){
		return null
	}
  if(filepath.match(/^\w+:/) || filepath.match(/^\//)){
    return filepath
  }
  return path.resolve(process.cwd(), filepath)
}