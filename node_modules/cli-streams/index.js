var path = require('path')
var fs = require('fs')

module.exports = function(input, output){

	var inputStream = process.stdin
	var outputStream = process.stdout

	if(input){
		if(typeof(input)==='string'){
			if(!fs.existsSync(input)){
		    console.error('error - file: ' + inputpath + ' does not exit')
		    process.exit(1)
		  }
		  inputStream = fs.createReadStream(input)
		}
		else{
			inputStream = input
		}
	}

	if(output){
		if(typeof(output)==='string'){
		  var outputfolder = path.dirname(output)
		  if(!fs.existsSync(outputfolder)){
		    console.error('error - folder: ' + outputfolder + ' does not exit')
		    process.exit(1)
		  }
		  outputStream = fs.createWriteStream(output)
		}
		else{
			outputStream = output
		}
	}

	return {
		input:inputStream,
		output:outputStream
	}
}