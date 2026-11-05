import http from 'http'
import { WebSocketServer } from 'ws'


const server = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
        return;
    }
    res.writeHead(404);
    res.end('Not Found');
})

const wss = new WebSocketServer({ server })


const rooms = new Map();

wss.on('connection', (socket, request) => {
    const parsedUrl = new URL(request.url, 'http://localhost:8080');
    const roomId = parsedUrl.searchParams.get('room');
    const userId = parsedUrl.searchParams.get('userId') || 'anon';


    console.log(`User ${userId} connected to room ${roomId}`);

    // Cretae connection socket for rooms
    if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set())
    }
    const room = rooms.get(roomId)
    room.add(socket);

    socket.on('message', (data) => {

        const message = data.toString()

    for (const client of room) {
        if (client !== socket && client.readyState === 1) {
        client.send(message);
        }
    }
    });


    socket.on('close', () => {
    room.delete(socket);
    console.log(`User ${userId} left room ${roomId}`);

    if (room.size === 0) {
        rooms.delete(roomId);
        console.log(`Room ${roomId} is empty and closed.`);
    }
    });


    

});

server.listen(8080, () => {
    console.log('Server listening on http://localhost:8080 and ws://localhost:8080');
})