const datamodel = require('../models/datamodel');
datamodel.init();
postModel = datamodel.postModel;
loginModel = datamodel.loginModel;

const bcrypt = require('bcrypt');
const saltRounds = 10; // TODO: i dont know what this does. encryption seed?

function errorFn(err) {
    console.log('Error found. Please trace!');
    console.log(err);
}

// TODO
function init(server) {
    req.session.logged_in = null;
    server.get('/', function(req, resp) {
        if (req.session.logged_in == null) {
            resp.redirect('/register');
        } else {
            postModel.find({}).lean().then(function(post_data) {
                loginModel.findOne({ user: req.session.logged_in }).lean().then(function(login_data) {
                    resp.render('main', {
                        layout: 'index',
                        title: 're*curate',
                        style: 'main.css',
                        post_data: post_data,
                        favorite_stores: login_data.stores
                    });
                }).catch(errorFn);
            }).catch(errorFn);
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
    server.get('/logout', function(req, resp) {
        req.session.destroy(function(err) {
            resp.redirect('/register');
        });
    })
    server.get('/profile', function(req, resp) {
        resp.render('profile', {
            layout: 'index',
            title: 'profile',
            style: 'review.css',
            user: req.session.logged_in
        });
    });

    server.post('/create-user', function(req, resp) {
        if (req.body.pass === req.body.passconf) {
            bcrypt.hash(req.body.pass, saltRounds, function(err, hash) {
                const loginInstance = loginModel({
                    user: req.body.user,
                    pass: hash
                });
            
                loginInstance.save().then(function(login) {
                    console.log('User created');
                    resp.redirect('/login');
                }).catch(errorFn); 
            });
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
        const searchQuery = { user: req.body.user };

        loginModel.findOne(searchQuery).then(function(login){
            console.log('Finding user');
            if (login != undefined && login._id != null) {
                bcrypt.compare(req.body.pass, login.pass, function(err, result) {
                    if (result) {
                        req.session.logged_in = req.body.user; // TODO: replace with session mgmt or smt
                        resp.redirect('/');
                    } else {
                        resp.render('dialog', {
                            layout: 'index',
                            title: 're*curate',
                            style: 'form.css',
                            message: 'Username and password do not match.'
                        });
                    } 
                });
            } else {
                resp.render('dialog', {
                    layout: 'index',
                    title: 're*curate',
                    style: 'form.css',
                    message: 'User not found.'
                });
            }
        }).catch(errorFn);
    })
    
    server.post('/create-review', function(req, resp) {
        const reviewInstance = postModel({
            post_title: req.body.title,
            post_user: req.session.logged_in,
            post_store: req.body.storename,
            post_content: req.body.review,
            post_image: req.body.image
        });
        reviewInstance.save().then(function(review) {
            console.log('Review created');
            resp.redirect('/');
        }).catch(errorFn); 
    })

    // TODO: create storepages
    server.get('/store/:storename', function(req, resp) {
        const storename = req.params.storename;
        const searchQuery = { post_store: storename };

        postModel.find(searchQuery).lean().then(function(post_data) {
            loginModel.findOne({ user: req.session.logged_in }).lean().then(function(login_data) {
                let is_fav = false;
                for (let store in login_data.stores) {
                    if (store === storename) {
                        is_fav = true;
                        break;
                    }
                }
                resp.render('store', {
                    layout: 'index',
                    title: storename,
                    style: 'store.css',
                    post_data: post_data,
                    is_fav: is_fav
                })
            }).catch(errorFn);
        }).catch(errorFn);
    })
    server.post('add-fav', function(req, resp) {
        loginModel.findOne({ user : req.session.logged_in }).lean().then(function(login_data) {
            let stores = login_data.stores;
            stores.append(req.body.storename);
            login_data.stores = stores;

            login_data.save().then(function(result) {
                resp.redirect('/store/'+req.body.storename);
            }).catch(errorFn);
        }).catch(errorFn);
    })
}

module.exports.init = init;