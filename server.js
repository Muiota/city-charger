/*jslint browser: true*/
/*global require */

let cc = require('config-multipaas'),
    finalhandler = require('finalhandler'),
    http = require("http"),
    Router = require('router'),
    fs = require('fs'),
    serveStatic = require("serve-static"),
    application = require("./serverlogic/city-charger-app.js");

let config = cc();
let app = Router();

// Serve up static files
app.use(serveStatic('assets'));

console.log("Routes Initialization");
const routes = Object.values(application.dictionary.Routes);
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
    console.log("Route " + route + " complete");
}

// API routes
app.get("/status", function (req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end("{status: 'ok'}\n");
})


app.get("/staftus", function (req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end("{status: 'ok'}\n");
})

// Create server 
let server = http.createServer(function (req, res) {
  let done = finalhandler(req, res);
  app(req, res, done);
});

server.listen(config.get('PORT'), config.get('IP'), function () {
    console.log("Listening on " + config.get('IP') + ", port " + config.get('PORT'));
    console.log("Application version " + application.version());
});
