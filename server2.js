const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index2.html'); // Update the path
});

// Serve the socket.io.js file from the current directory
app.get('/socket.io.js', (req, res) => {
    res.sendFile(__dirname + '/socket.io.js');
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(8089, () => {
    console.log('Server listening on *:8089');
});
