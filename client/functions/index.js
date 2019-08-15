const functions = require('firebase-functions');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = 3274

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

module.exports = function(io) {
  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
      console.log('message: ' + msg);
    });
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
}

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});
exports.app = functions.https.onRequest(app);