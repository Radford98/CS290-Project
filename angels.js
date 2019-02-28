
var express = require('express');
var app = express();
var path = require('path');
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 2568);

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('home');
})

app.get('/pcs', function (req, res) {
    context = {};
    context.glory = 448;
    res.render('pcs', context);
})

app.get('/npcs', function (req, res) {
    res.render('npcs');
})

app.get('/world', function (req, res) {
    res.render('world');
})

app.get('/review', function (req, res) {
    res.render('review');
})

app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function () {
    console.log('Express started on flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});
