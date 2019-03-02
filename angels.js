
var express = require('express');
var app = express();
var request = require('request');
var session = require('express-session');
var credentials = require('./credentials.js');
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
var bodyParser = require('body-parser');

app.use(session({ secret: 'ImASecret' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 2569);

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('home');
})

app.get('/pcs', function (req, res) {
    context = {};
    context.glory = (req.session.glory + 448) || 448;
    res.render('pcs', context);
})

app.get('/npcs', function (req, res) {
    res.render('npcs');
})



// Accepts a real city from which to grab the weather and a game city to which to associate that weather.
function reqWeather(rCity, gCity, context, res, complete) {
    var ask = 'http://api.openweathermap.org/data/2.5/weather?q=' + rCity + '&APPID=' + credentials.owmKey;
    request(ask, function (err, response, body) {
        if (err) {
            res.write(JSON.stringify(err));
            res.end();
        }

        body = JSON.parse(body);    // Convert the body string into a useful object.
        // The math in the next line is to convert from kelvin to farenheit.
        context[gCity] = (9 / 5 * (body.main.temp - 273.15) + 32).toFixed(1) + " and " + body.weather[0].main;
        complete();

    });
};

app.get('/world', function (req, res) {
    var context = {};
    var callbackCount = 0;
    reqWeather("Salem", "laristal", context, res, complete);
    reqWeather("Newport", "warsteep", context, res, complete);
    reqWeather("Seattle", "dostearan", context, res, complete);
    reqWeather("Denver", "aldurn", context, res, complete);
    reqWeather("Kansas City", "cartol", context, res, complete);

    // Complete counts the number of times reqWeather is called and renders the page once every city is counted.
    function complete() {
        callbackCount++;
        if (callbackCount >= 5) {
            res.render('world', context);
        }
    }
});


app.get('/review', function (req, res) {
    var context = {
        stars: [1, 2, 3, 4, 5],
        pcs: ["Gulak", "Xeka", "Caelynn", "Ari"],
        npcs: ["Romana", "Ashkenaz", "Lucus", "Alastra", "Hagatha"],
        kingdoms: ["Dostearan", "Aldurn"]
    };

    res.render('review', context);
})

app.use('/forms', require('./myForms.js'));

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
