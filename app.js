var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

function randomInteger(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

var PERIOD_SEND_TEMPERATURE = 5000;
var CHANNEL_TEMPERATURE = 'temperature';

function getTemperature() {
    return randomInteger(20, 27);
}

function emitTemperature(socket) {
    var temperature = getTemperature();
    socket.emit(CHANNEL_TEMPERATURE, temperature);
}

function initiatePeriodicalTemperatureEmits(socket) {
    setInterval(emitTemperature, PERIOD_SEND_TEMPERATURE, socket);
}

var sensorState = true;

function proximityChecker(socket) {
    sensorState = !sensorState;
    socket.emit('proximity', sensorState);

    var nextChange = randomInteger(1, 15) * 1000;
    setTimeout(proximityChecker, nextChange, socket);
}

io.on('connection', function (socket) {
    initiatePeriodicalTemperatureEmits(socket);

    proximityChecker(socket);
});

server.listen(8080);