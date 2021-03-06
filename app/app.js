
var path = require('path');
var ROOT = path.resolve(__dirname) + '/..';

var fs = require('fs'),
    http = require('http'),
    https = require('https'),
    express = require('express'),
    cs = require('cansecurity'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var config = require(ROOT + '/config/config');

mongoose.connect(
  'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db
);

// bootstrap models
var models_path = ROOT + '/app/models';
// borrowed walk method from https://github.com/linnovate/mean/blob/master/server.js
var walk = function(path) {
  fs.readdirSync(path).forEach(function(file) {
    var newPath = path + '/' + file;
    var stat = fs.statSync(newPath);
    if (stat.isFile()) {
      if (/(.*)\.(js)/.test(file)) {
        require(newPath);
      }
    } else if (stat.isDirectory()) {
      walk(newPath);
    }
  });
};
walk(models_path);

var privateKey  = fs.readFileSync(ROOT + '/app/cert/privatekey.pem').toString();
var certificate = fs.readFileSync(ROOT + '/app/cert/certificate.pem').toString();
var credentials = {key: privateKey, cert: certificate};

var cors = require(ROOT + '/lib/cors');
var security = require(ROOT + '/lib/security');
var cansec = cs.init(security.init);

var app = express();
var secureServer = https.createServer(credentials, app);
var server = http.createServer(app);

app.use(express.logger());        // Log requests to the console
app.use(cors);                    // Enable CORS
app.use(cansec.validate);         // Initialize authentication
app.use(express.bodyParser());    // Needed for POST requests
app.use(express.errorHandler({    // A standard error handler
  dumpExceptions: true, 
  showStack: true 
}));

require(ROOT + '/config/routes').routes(app, cansec);

// Start up the server on the port specified in the config
server.listen(config.server.listenPort, '0.0.0.0', 511, function() {
  console.log('My App Server - listening on port: ' + config.server.listenPort);
});
secureServer.listen(config.server.securePort, function () {
  console.log('My App Server - listening on secure port: ' + config.server.securePort);
});

module.exports = app;
