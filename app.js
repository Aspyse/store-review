// npm init
// npm i express express-handlebars body-parser mongoose

const express = require('express');
const server = express();

const bodyParser = require('body-parser');
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const handlebars = require('express-handlebars');
server.set('view engine', 'hbs');
server.engine('hbs', handlebars.engine({
    extname: 'hbs',
}));

server.use(express.static('public'));

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/review');

function errorFn(err) {
    console.log('Error found. Please trace!');
    console.log(err);
}

// TODO: CREATE SCHEMA
const loginSchema = new mongoose.Schema({
    user: { type: String },
    pass: { type: String }
}, { versionKey: false });

const loginModel = mongoose.model('login', loginSchema)

// SAMPLE POST SCHEMA
const postSchema = new mongoose.Schema({
    post_title: { type: String },
    post_user: { type: String },
    post_store: { type: String },
    post_content: { type: String }
}, { versionKey: false });

const postModel = mongoose.model('post', postSchema); // NOTE: becomes "posts"

// TODO
server.get('/', function(req, resp) {
    resp.render('registration', {
        layout: 'form',
        title: 'register to re*curate'
    });
});

server.post('/create-user', function(req, resp) {
    const loginInstance = loginModel({
        user: req.body.user,
        pass: req.body.pass
    });

    loginInstance.save().then(function(login) {
        console.log('User created');

        resp.render('login', {
            layout: 'form',
            title: 're*curate login'
        });
    }).catch(errorFn);
});

server.post('/read-user', function(req, resp) {
    const searchQuery = { user: req.body.user, pass: req.body.pass };

    loginModel.findOne(searchQueary).then(function(login){
        console.log('Finding user');

        if (login != undefined && login._id != null) {
            resp.render('index', {
                layout: 'main',
                title: 're*curate'
            });
        } else {
            alert('Failed to log in. Please check username and password.');
        }
    }).catch(errorFn);
})

// TODO: create storepages
server.get('/store/:storename', function(req, resp) {
    const storename = req.params.storename;
    resp.send()
})

/* SAMPLE (take note of post_data and friend_data):
  postModel.find(searchQuery).lean().then(function(post_data){
	friendModel.find(searchQuery).lean().then(function(friend_data){
      resp.render('main',{
        layout          : 'index',
        title           : 'Social Media 4 Homepage',
        'post-data'     : post_data,
        'friend-data'   : friend_data
      });
    }).catch(errorFn);
  }).catch(errorFn);
*/

function finalClose() {
    console.log('Close connection at the end!');
    mongoose.connection.close();
    process.exit();
}

process.on('SIGTERM', finalClose);
process.on('SIGINT', finalClose);
process.on('SIGQUIT', finalClose);

const port = process.env.PORT | 3000;
server.listen(port, function() {
    console.log('Listening at port ' +port);
});
