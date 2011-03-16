var hottopod = require('./hottopod');

hottopod.listen(8080);
var localhost = hottopod.host('localhost');
localhost.bind('/hello', 'GET', function (req, res) {
	res.write('Hello World!');
	res.end();
});
