// npm init -y
// npm i express express-handlebars body-parser mongoose bcrypt express-session connect-mongodb-session

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

const routes = require('./controllers/routes');
routes.init(server);

const session = require('express-session');
const mongoStore = require('connect-mongodb-session')(session);

server.use(session({
    secret: 'idk bruh',
    saveUninitialized: true,
    resave: false,
    store: new mongoStore({
        uri: process.env.DATABASE_URL,
        collection: 'mySession',
        expires: 14*24*60*60*1000 // 14 days
    })
}));

const port = process.env.PORT | 3000;
server.listen(port, function() {
    console.log('Listening at port ' +port);
});
