var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);


function randomFloat(low, high) {
    var diff = high - low + 1;
    var randomBetweenZeroAndDiff = Math.random() * diff;
    var randomBetweenLowAndHigh = randomBetweenZeroAndDiff + low;
    return randomBetweenLowAndHigh;
}

function randomBoolean() {
    return Math.random() < 0.5;
}

const PERIOD_SEND_TEMPERATURE = 5000;
const CHANNEL_TEMPERATURE = 'temperature';
const CHANNEL_PROXIMITY = 'proximity';

function getTemperature() {
    var random = randomFloat(20, 27);
    return random.toFixed(2);
}

function emitTemperature(socket) {
    var temperature = getTemperature();
    socket.emit(CHANNEL_TEMPERATURE, temperature);
}

function initiatePeriodicalTemperatureEmits(socket) {
    setInterval(emitTemperature, PERIOD_SEND_TEMPERATURE, socket);
}

function scheduleNextProximityEmit(socket) {
    var nextChangeSeconds = randomFloat(1, 15) * 1000;
    setTimeout(emitProximityAndScheduleNextEmit, nextChangeSeconds, socket);
}

function emitProximityAndScheduleNextEmit(socket) {
    var sensorState = randomBoolean();
    socket.emit(CHANNEL_PROXIMITY, sensorState);

    scheduleNextProximityEmit(socket);
}

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    initiatePeriodicalTemperatureEmits(socket);

    emitProximityAndScheduleNextEmit(socket);
});

server.listen(8080);