const datamodel = require('../models/datamodel');

// TODO
function init(server) {
    let logged_in = false;
    server.get('/', function(req, resp) {
        if (!logged_in) {
            resp.redirect('/register');
        } else {
            postModel.find({}).lean().then(function(post_data) {
                resp.render('main', {
                    layout: 'index',
                    title: 're*curate',
                    post_data: post_data
                });
            })
        }
    });
    server.get('/register', function(req, resp) {
        resp.render('registration', {
            layout: 'form',
            title: 'register to re*curate'
        });
    });
    server.get('/login', function(req, resp) {
        resp.render('login', {
            layout: 'form',
            title: 're*curate login'
        });
    });

    server.post('/create-user', function(req, resp) {
        if (req.body.pass === req.body.passconf) { // TODO: feedback for passwds not matching
            const loginInstance = loginModel({
                user: req.body.user,
                pass: req.body.pass
            });
        
            loginInstance.save().then(function(login) {
                console.log('User created');
                resp.redirect('/login');
            }).catch(errorFn);
        }
    });

    server.post('/read-user', function(req, resp) {
        const searchQuery = { user: req.body.user, pass: req.body.pass };

        loginModel.findOne(searchQuery).then(function(login){
            console.log('Finding user');

            if (login != undefined && login._id != null) { // TODO: feedback for login failure
                logged_in = true;
                resp.redirect('/');
            }
        }).catch(errorFn);
    })

    // TODO: create storepages
    server.get('/store/:storename', function(req, resp) {
        const storename = req.params.storename;
        const searchQuery = { post_store: storename };

        postModel.find(searchQuery).lean().then(function(post_data) {
            resp.render('store', {
                layout: 'storepage',
                title: storename,
                post_data: post_data
            })
        })
    })
}

module.exports.init = init;