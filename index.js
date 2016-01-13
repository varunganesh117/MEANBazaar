var app = require('./server');

app().listen(3000, function(err){
	if(err){
		console.log(err);
		process.exit(0);
	}
	console.log("Server Started! Listening on port 3000");
});	