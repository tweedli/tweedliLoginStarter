var express = require('express');
var bodyParser = require('body-parser');
// Use cors so we can test our app from localhost, cors allows requests from localhost.
var cors = require('cors');
var port = port || 3000

var app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended : true}))

var path = require('path');
var assetFolder = path.join(__dirname);
console.log(assetFolder)
app.use(express.static(assetFolder));

app.set('views', __dirname);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');







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
			console.log("hashPass" + hashPass)
			
			var user = new TweedliUserCollection({username: attrs.username, hashedPassword: hashPass})
			user.save(function(err, info){
				if(err) reject(err)
				console.log(info)
				resolve(info)
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
			if(err) reject(err)
			console.log(userInfo)
			console.log("alkafa")
			console.log(attrs.password + "\n" + userInfo.hashedPassword)
			bcrypt.compare(attrs.password, userInfo.hashedPassword)
			.then(function(x){
				console.log(x)
				if(x === true){
					resolve(x)
				} else {
					reject(x)
				}
			})
			.catch(function(err){
				reject(err)
			})
		
		})

	})
}





// exports.get = function(req, res){
// 	let user = req.params.userName
// 	console.log("user " + user)
// 	TwitterUserCollection.findOne({user: user}) 
// 	.then(data => {
// 		if(data){
// 		console.log("timeAdded " + data.timeAdded)
// 			if(moment(data.timeAdded).add(10, 'days').isAfter(moment())){
// 				res.status(200).send(data)
// 			} else {
// 				res.sendStatus(502)		
// 			}
// 		} else {
// 			res.sendStatus(502)
// 		}
// 	})
// 	.catch(err => {
// 		console.log("???" + err)
// 	})
// }

// exports.getTop = function(req, res){
// 	let user = req.params.userName
// 	console.log("user " + user)
// 	TwitterUserCollection.findOne({user: user}) 
// 	.then(data => {
// 		console.log(data.topStatuses)
// 		res.status(200).send(data.topStatuses)
// 	})
// 	.catch(err => {
// 		console.log("???" + err)
// 		res.sendStatus(502)
// 	})
// }

// exports.insert = function(req, res){
// 	let attrs = req.body
// 	TwitterUserCollection.findOneAndUpdate({user: attrs.user}, attrs, {upsert: true})
// 	.then(response => {
// 		res.status(302)
// 	})
// 	.catch(x => {
// 		res.sendStatus(502)
// 	})
// }

// exports.insertTop = function(req, res){
// 	let user  = req.body[0]
// 	let attrs = req.body[1]
// 	console.log(user)
// 	console.log(attrs)
// 	TwitterUserCollection.findOneAndUpdate({user: user}, attrs, {upsert: true})
// 	.then(response => {
// 		res.status(302)
// 	})
// 	.catch(x => {
// 		res.sendStatus(502)
// 	})
// }









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