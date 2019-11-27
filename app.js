const express = require('express');
const Keycloak = require('keycloak-connect');
const session = require('express-session');
const path = require('path');

const app = express();

var memoryStore = new session.MemoryStore();
var keycloak = new Keycloak({ store: memoryStore });
app.set('view engine', 'ejs');

app.use(
	session({
		secret: 'thisShouldBeLongAndSecret',
		resave: false,
		saveUninitialized: true,
		store: memoryStore
	})
);
app.use(keycloak.middleware());

app.get('/', keycloak.protect(), function(req, res) {
	//res.sendFile(path.join(__dirname + '/index.html'));
	console.log('Home Route - ' + new Date().toString());
	console.log(req.kauth.grant.access_token);
	//console.log(req.kauth.grant.access_token.content.resource_access);
	//console.log(req.kauth.grant.access_token.content.realm_access);
	// console.log(req.kauth.grant.id_token.content);
	// console.log(req.kauth.grant.access_token.content);
	// console.log(req.kauth.grant.refresh_token.content);
	//console.log(JSON.stringify(JSON.parse(req.session['keycloak-token']), null, 4));
	console.log('User Role: ' + req.kauth.grant.access_token.content.primary_role);
	res.render('index', {
		primary_role: req.kauth.grant.access_token.content.primary_role,
		username: req.kauth.grant.access_token.content.preferred_username
	});
});

/*
app.get('/test', function(req, res) {
	console.log('Test');
	res.render('test', {
		primary_role: 'role'
	});
});
*/
/*
app.get('/all', keycloak.protect('realm:admin'), function(req, res) {
	console.log('Getting all');
	res.sendFile(path.join(__dirname + '/all.html'));
	// res.status(200).json({ students, teachers });
});

app.get('/students', keycloak.enforcer('studentResource:view'), function(req, res) {
	console.log('Getting Students');
	// console.log(req.kauth);
	// console.log(keycloak.tokenParsed);
	// console.log(JSON.stringify(JSON.parse(req.session['keycloak-token']), null, 4));
	// console.log(req);
	console.log(req.permissions);
	res.sendFile(path.join(__dirname + '/students.html'));
	// res.status(200).json({ students });
});

app.get('/teachers', keycloak.enforcer('teacherResource:view'), function(req, res) {
	console.log('Getting Teachers');
	res.sendFile(path.join(__dirname + '/teachers.html'));
	// res.status(200).json({ teachers });
});
*/
app.get('/addStudent', keycloak.enforcer('addStudent:add'), function(req, res) {
	console.log('Add Student Route - ' + new Date().toString());
	//console.log(req.permissions);
	//console.log(req.kauth.grant.access_token.content.resource_access);
	//console.log(req.kauth.grant.access_token.content.realm_access);
	res.sendFile(path.join(__dirname + '/addStudent.html'));
});

app.get('/editStudent', keycloak.enforcer('editStudent:edit'), function(req, res) {
	console.log('Edit Student Route - ' + new Date().toString());
	// console.log(req.permissions);
	res.sendFile(path.join(__dirname + '/editStudent.html'));
});

app.get('/viewStudent', keycloak.enforcer('viewStudent:view'), function(req, res) {
	console.log('View Student Route - ' + new Date().toString());
	// console.log(req.permissions);
	res.sendFile(path.join(__dirname + '/viewStudent.html'));
});

// app.get('/studentsPage', function(req, res) {
// 	console.log('Getting Students Page');
// 	res.sendFile(path.join(__dirname + '/students.html'));
// });
// app.get('/teachersPage', function(req, res) {
// 	console.log('Getting Teachers Page');
// 	res.sendFile(path.join(__dirname + '/teachers.html'));
// });
// app.get('/allData', function(req, res) {
// 	console.log('Getting All data Page');
// 	res.sendFile(path.join(__dirname + '/all.html'));
// });
app.use(keycloak.middleware({ logout: '/' }));

app.listen(3000, function() {
	console.log('Listening at http://localhost:3000');
});
