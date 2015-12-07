// require express and other modules
var express = require('express'),
    app = express();
    // require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

// configure bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files from public folder
app.use(express.static(__dirname + '/public'));
// Allow CORS: we'll use this today to reduce security so we can more easily test our code in the browser.
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.use(express.static(__dirname + '/public/images'));
	console.log('use localhost:3000/profile_image.png');

	app.get(function (req, res){
		res.writehead(200, {'content-type': 'text/plain'});
	});
/************
 * DATABASE *
 ************/
var profile = [
{name: "Matt Seegan", github_link: "https://github.com/mseegan", 
github_profile_image: "https:/\/avatars1.githubusercontent.com/u/15822069?v=3&s=460", 
current_city: "San Francisco", 
family_members: [{name: "Tom", relationship: "Father"}, 
{name: "Kim", relationship: "Mother"}, 
{name: "Brooke", relationship: "Sister"}]
}];

var vidya = [{_id: 1, title: "Dota 2", genre: "moba", singleplayer: false, multiplayer: true}, 
{_id: 2, title: "Starcraft 2", genre: "rts", singleplayer: true, multiplayer: true}, 
{_id: 3, title: "Hatoful Boyfriend", genre: "otome", singleplayer: true, multiplayer: false}
];
// your hardcoded data here

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */



	


app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});



/*
 * JSON API Endpoints
 */

app.get('/api', function api_index (req, res){
  res.json({
    message: "Welcome to my personal api!",
    documentation_url: "https://github.com/mseegan/express_self_api/blob/master/README.md", // CHANGE THIS TO LINK TO YOUR README.md
    base_url: "http://rocky-scrubland-8062.com",
    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints"}
    ]
  });
});

app.get('/api/vidya/search', function search(req, res){
	var data = {vidya:[]};
	vidya.forEach(function (element, index) {
		if(element.task == req.query.q){
			console.log(req.query.q);
			data.vidya.push(vidya[index]);
		}
	});
	res.json(data);
});


app.get('/api/vidya', function index(req, res) {
	res.json({vidya: vidya});
});

app.get('/api/profile', function index(req, res) {
	res.json({profile: profile});
});

app.post('/api/vidya', function create(req, res) {
	var data = req.body;
	data._id = 0; 
	vidya.forEach(function (element, index) {
		data._id = element._id >= data._id ? element._id+1 : data._id;

	});
	vidya.push(data);
	res.json(data);

});

app.get('/api/vidya/:id', function show(req, res) {
	var data;
	vidya.forEach(function (element, index) {
		if(element._id == req.params.id){
			data = vidya[index];
		}
	});
	res.json(data);
});

app.put('/api/vidya/:id', function update(req, res) {
	var data = req.body;
	data._id = 0; 
	vidya.forEach(function (element, index) {
		data._id = element._id >= data._id ? element._id : data._id;

	});
	vidya.push(data);
	res.json(data);
});
app.delete('/api/vidya/:id', function destroy(req, res) {
	var data;
	vidya.forEach(function (element, index) {
		if(element._id == req.params.id){
			data = vidya[index];
			vidya.splice(index, 1);
		}
	});
	res.json(data);
});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
