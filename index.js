var express = require('express');
var wagner = require('wagner-core');

require('./dependencies')(wagner);
require('./models')(wagner);
	
var app = express();

wagner.invoke(require('./auth.js'), { app : app });

app.use('/api/v1', require('./api.js')(wagner));

app.use(express.static('angular'));

app.listen(3000, function(err){
	if(err){
		console.log(err);
		process.exit(0);
	}
	console.log("Server Started! Listening on port 3000");
});	