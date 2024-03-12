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
// SAMPLE POST SCHEMA
const postSchema = new mongoose.Schema({
    post_title: { type: String },
    post_image: { type: String }
}, { versionKey: false});

const postModel = mongoose.model('post', postSchema); // NOTE: becomes "posts"

// TODO
server.get('/', function(req, resp) {
    resp.render('main', {
        layout: 'index',
        title: 're*curate'
    });
});

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

const port = process.env.PORT | 3000;
server.listen(port, function() {
    console.log('Listening at port ' +port);
});
