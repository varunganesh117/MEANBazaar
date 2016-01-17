var app = require('./server');
var wagner = require('wagner-core');

require('./models')(wagner);

app().listen(3000, function(err){
	if(err){
		console.log(err);
		process.exit(0);
	}
	console.log("Server Started! Listening on port 3000");
});	