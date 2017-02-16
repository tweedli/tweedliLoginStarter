var express = require('express');
var app = express();

var port = port || 3000

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var cors = require('cors');
app.use(cors());
app.use(bodyParser.urlencoded({extended : true}))

var path = require('path');
var assetFolder = path.join(__dirname);
console.log(assetFolder)
app.use(express.static(assetFolder));

app.set('views', __dirname);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


/**************** MONGOOSE/BCRYPT *****************/

var bcrypt = require('bcryptjs')
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/tweedliLogin')
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error: '));

conn.once('open', function() {
	console.log("We are connected")
})

var tweedliUserSchema = new Schema({
	username      : String,
	hashedPassword: String
})

var TweedliUserCollection = mongoose.model('TweedliUserCollection', tweedliUserSchema)


function authSignup(attrs){

	return new Promise(function(resolve, reject){
		bcrypt.hash(attrs.password, 0)
		.then(function(hashPass){		
			var user = new TweedliUserCollection({username: attrs.username, hashedPassword: hashPass})
			user.save(function(err, info){
				if(err){ 
					reject(err)
				} else {
					resolve(info)
				}
			})
		})
		.catch(function(err){
			reject(err)
		})
	})
}

function authLogin(attrs){
	
	return new Promise(function(resolve, reject){
		TweedliUserCollection.findOne({username: attrs.username}, function(err, userInfo){
			if(err) {
				reject(err)
			} else {
				bcrypt.compare(attrs.password, userInfo.hashedPassword)
				.then(function(result){
					if(result === true){
						resolve(result)
					} else {
						reject(result)
					}
				})
				.catch(function(err){
					reject(err)
				})
			}
		})
	})
}


/**************** ENDPOINTS *****************/

app.post('/auth/signup', function(request, response){
	authSignup(request.body)
	.then(function(info){
		response.send(info).status(200)
	})
	.catch(function(err){
		console.log(err)
	})
})

app.post('/auth/login', function(request, response){
	authLogin(request.body)
	.then(function(info){
		response.send(info).status(200)
	})
	.catch(function(err){
		console.log(err)
		response.send().status(403)
	})
})



app.get('/', function(request, response){
	response.render('index')
})

app.get('/login', function(request, response){
	response.render('login')
})

app.listen(port)
console.log("listening on localhost:" + port)