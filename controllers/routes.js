const datamodel = require('../models/datamodel');
datamodel.init();
postModel = datamodel.postModel;
loginModel = datamodel.loginModel;

function errorFn(err) {
    console.log('Error found. Please trace!');
    console.log(err);
}

// TODO
function init(server) {
    let logged_in = "";
    server.get('/', function(req, resp) {
        if (logged_in === "") {
            resp.redirect('/register');
        } else {
            postModel.find({}).lean().then(function(post_data) {
                resp.render('main', {
                    layout: 'index',
                    title: 're*curate',
                    style: 'main.css',
                    post_data: post_data
                });
            })
        }
    });
    server.get('/register', function(req, resp) {
        resp.render('registration', {
            layout: 'index',
            title: 'register to re*curate',
            style: 'form.css'
        });
    });
    server.get('/login', function(req, resp) {
        resp.render('login', {
            layout: 'index',
            title: 're*curate login',
            style: 'form.css'
        });
    });
    server.get('/review', function(req, resp) {
        resp.render('review', {
            layout: 'index',
            title: 'write a review',
            style: 'review.css'
        });
    });
    server.get('/profile', function(req, resp) {
        resp.render('profile', {
            layout: 'index',
            title: 'profile',
            style: 'review.css',
            user: logged_in
        });
    });

    server.post('/create-user', function(req, resp) {
        if (req.body.pass === req.body.passconf) {
            const loginInstance = loginModel({
                user: req.body.user,
                pass: req.body.pass
            });
        
            loginInstance.save().then(function(login) {
                console.log('User created');
                resp.redirect('/login');
            }).catch(errorFn);
        } else {
            resp.render('dialog', {
                layout: 'index',
                title: 're*curate',
                style: 'form.css',
                message: 'Passwords do not match.'
            });
        }
    });

    server.post('/read-user', function(req, resp) {
        const searchQuery = { user: req.body.user, pass: req.body.pass };

        loginModel.findOne(searchQuery).then(function(login){
            console.log('Finding user');

            if (login != undefined && login._id != null) {
                logged_in = req.body.user;
                resp.redirect('/');
            } else {
                resp.render('dialog', {
                    layout: 'index',
                    title: 're*curate',
                    style: 'form.css',
                    message: 'Username and password do not match.'
                });
            }
        }).catch(errorFn);
    })

    // TODO: create storepages
    server.get('/store/:storename', function(req, resp) {
        const storename = req.params.storename;
        const searchQuery = { post_store: storename };

        postModel.find(searchQuery).lean().then(function(post_data) {
            resp.render('store', {
                layout: 'index',
                title: storename,
                style: 'store.css',
                post_data: post_data
            })
        })
    })
}

module.exports.init = init;