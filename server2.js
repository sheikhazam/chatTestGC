const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path'); // Add this line

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index2.html')); // Update the path
});

// Add this route to serve the socket.io.js file
app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'node_modules/socket.io/client-dist/socket.io.js'));
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