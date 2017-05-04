var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

// Sends fake temperatures each tPeriod milis
var tPeriod = 5000;

function temperatureChecker(socket) {
    var temperature = randomInt(24, 27);
    socket.emit('temperature', temperature);
}

// Sends sensor status only when it is changed
// Sensor data is changed in random intervals in order to simulate moving object

var sensorState = true;

function proximityChecker(socket) {
    sensorState = !sensorState;
    socket.emit('proximity', sensorState);

    var nextChange = randomInt(1, 15) * 1000;
    setTimeout(proximityChecker, nextChange, socket);
}

io.on('connection', function (socket) {
    setInterval(temperatureChecker, tPeriod, socket);

    var checkProximity = randomInt(1, 3) * 1000;
    setTimeout(proximityChecker, checkProximity, socket);
});

server.listen(8080);