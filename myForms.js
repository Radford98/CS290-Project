var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    var qParams = [];
    for (var p in req.query) {  // Pull the data from the URL query
        qParams.push({ 'name': p, 'value': req.query[p] });
    }
    var context = {};
    context.dataList = qParams;
    context.type = "GET";
    
    res.redirect('/review');
 
});

router.post('/', function (req, res) {
    var qParams = [];
    for (var p in req.body) {   // Pull the data from the body submission
        qParams.push({ 'name': p, 'value': req.body[p] });
    }
    var context = {};
    context.dataList = qParams;
    context.type = "POST";
    //res.render('forms', context);
    if (!req.session.glory) {
        req.session.glory = Number(req.body.giveGlory);
    } else {
        req.session.glory += Number(req.body.giveGlory);
    }
    console.log(context);
    console.log(req.session.glory);
    res.redirect('/review');
});

module.exports = router;