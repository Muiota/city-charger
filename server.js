/*jslint browser: true*/
/*global require */

let cc = require('config-multipaas'),
    finalhandler = require('finalhandler'),
    http = require("http"),
    Router = require('express'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    serveStatic = require("serve-static"),
    application = require("./serverlogic/city-charger-app.js");

let config = cc();
let app = Router();

// Serve up static files
app.use(serveStatic('assets'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


console.log("Static routes initialization");
const routes = Object.values(application.dictionary.StaticRoutes);
console.log(routes);
for (let i in routes) {
    if (!routes.hasOwnProperty(i)) {
        continue;
    }
    let route = routes[i];
    app.get(route, function (req, res) {
        //console.log(req);
        application.handleRequest(req, res);
       // console.log(res);
    })
    console.log("Static route " + route + " complete");
}

console.log("Api routes initialization");
const routesApi = Object.values(application.dictionary.ApiRoutes);
console.log(routesApi);
for (let i in routesApi) {
    if (!routesApi.hasOwnProperty(i)) {
        continue;
    }
    let route = routesApi[i];
    app.post(route, function (req, res) {
        //console.log(req);
        application.handleRequest(req, res);
        // console.log(res);
    })
    console.log("Api route " + route + " complete");
}

// Create server 
let server = http.createServer(function (req, res) {
  let done = finalhandler(req, res);
  app(req, res, done);
});

server.listen(config.get('PORT'), config.get('IP'), function () {
    console.log("Listening on " + config.get('IP') + ", port " + config.get('PORT'));
    console.log("Application version " + application.version());
});
