var fs = require('fs'),
	path = require('path'),
	express = require('express'),
	formidable = require('formidable');

var app = express();
var port = 3000;
var output = path.resolve(__dirname, '../keygen_files');

console.log('Output directory: ', output);
// app.use(express.bodyParser());
app.use(express.static(__dirname + '/html'));

app.get('/', function(req, res) {
	res.render('index.html');
});

app.post('/upload', function(req, res) {
	var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
     	var newpath = path.resolve(output, files.keywords.name);
     	console.log('Temp file: ' + files.keywords.path);
     	fs.rename(files.keywords.path, newpath, function (err) {
        	if (err) {
        		res.send('Cannot upload file');
        	} else {
        		readFile(newpath, res);
        	}
        });
    });
}); 
app.post('/input', function(req, res) {
	var firstkey = req.body.keys1;
    var secondkey= req.body.keys2;
    var keylist1 = firstkey.split("+");
    var keylist2 = secondkey.split("+");
    if(keylist1.length>0 && keylist2.lenght>0){
    	var output = [];
		for(i=0; i<keylist1.length; i++){
			for(j=0; j<keylist2.length;j++){
				output.push(keylist1[i]+" " + keylist2[j]);
			}
		}  
		res.send('<a href="/">Upload more</a><br>' + output.join('<br>'));
    }
}); 

app.listen(port, function(err) {
	if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
});

function readFile(path, res) {
	console.log('Open file:', path);

	fs.readFile(path, 'utf8', function (err, data) {
		if (err) {
			console.err('Error while reading file.', err);
	        res.send('File Error!');
	    } else {
		  var lines = data.split(/\r\n|\n|\r/);
		  var output = [];
		  lines.forEach(function(line) {
		  	var col1 = line.split(',')[0];
		  	lines.forEach(function(line) {
		  		var col2 = line.split(',')[1];
		  		if (col1 !== col2) {
		  			output.push(col1 + ' ' + col2);
		  		}
		  	});
		  });
		  res.send('<a href="/">Upload more</a><br>' + output.join('<br>'));
		}
	});
}