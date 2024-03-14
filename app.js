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

const routes = require('./controllers/routes');
routes.init(server);

const port = process.env.PORT | 3000;
server.listen(port, function() {
    console.log('Listening at port ' +port);
});
