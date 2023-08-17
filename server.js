const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');

const server = https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
});

const wss = new WebSocket.Server({ server });

const users = [
    { id: 'user1', ws: null }, // Example users
    { id: 'user2', ws: null },
    { id: 'user3', ws: null }
];

wss.on('connection', (ws) => {
    console.log('A client connected:', ws.id);

    const user = users.find(u => u.ws === null);
    if (user) {
        user.ws = ws;
        ws.id = user.id;
        broadcastUsersList();
    } else {
        ws.close();
    }

    ws.on('message', (message) => {
        try {
            const messageObj = JSON.parse(message);
            if (messageObj.type === 'message') {
                const recipient = users.find(u => u.id === messageObj.targetUserId);
                if (recipient && recipient.ws) {
                    recipient.ws.send(JSON.stringify({
                        type: 'message',
                        content: messageObj.content,
                        senderId: messageObj.senderId
                    }));
                }
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    ws.on('close', () => {
        console.log('A client disconnected:', ws.id);
        const user = users.find(u => u.id === ws.id);
        if (user) {
            user.ws = null;
            broadcastUsersList();
        }
    });

    broadcastUsersList();
});

function broadcastUsersList() {
    const activeUsers = users.filter(u => u.ws !== null).map(u => ({ id: u.id }));
    users.forEach(user => {
        if (user.ws) {
            user.ws.send(JSON.stringify({ type: 'users', data: activeUsers }));
        }
    });
}

const PORT = 8089; // Use port 8089
server.listen(PORT, () => {
    console.log(`WebSocket server is running on port ${PORT}`);
});
