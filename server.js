const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

const clients = new Set();

server.on('connection', (client) => {
    // Add the new client to the list
    clients.add(client);

    // Send a welcome message to the new client
    client.send('Welcome to the chat!');

    // Broadcast messages to all connected clients
    client.on('message', (message) => {
        broadcast(message);
    });

    // Remove the client from the list when they disconnect
    client.on('close', () => {
        clients.delete(client);
    });
});

function broadcast(message) {
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}
