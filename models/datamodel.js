const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/reviewdb');

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
    post_content: { type: String },
    post_image: { type: String }
}, { versionKey: false });

const postModel = mongoose.model('post', postSchema); // NOTE: becomes "posts"

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

function init() {
    function finalClose() {
        console.log('Close connection at the end!');
        mongoose.connection.close();
        process.exit();
    }

    process.on('SIGTERM', finalClose);
    process.on('SIGINT', finalClose);
    process.on('SIGQUIT', finalClose);
}

module.exports.init = init;
module.exports.loginModel = loginModel;
module.exports.postModel = postModel;