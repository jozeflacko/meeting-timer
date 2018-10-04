var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');
app = express();
app.use(serveStatic(__dirname + "/dist"));
var port = process.env.PORT || 5000;
app.listen(port);

var router = express.Router();
router.get('/test', function(req, res, next) {  
    res.status(200).send("App works!")  
});  

console.log('server started at port: '+ port);