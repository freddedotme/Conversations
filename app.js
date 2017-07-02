var ws = require('nodejs-websocket');
var fs = require("fs");

require('user.js');

var users = [];
var counter = 0;

var server = ws.createServer(function (user) {
    addUser(user);

    user.on('text', function (word) {

    });

    user.on('close', function (code, reason) {

    });

    counter++;
}).listen(8001);

function getUser(user) {

}

function addUser(user) {
    var user = new User(user, counter, 'random', 'image.jpg');
}
