import http from 'http'
import { WebSocketServer } from 'ws'
import { ensureRoom, getRoomState, addNodes, moveNode, deleteNode, addConnection, deleteConnection } from './roomQueries.js'

// Create Server
const server = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
        return;
    }
    res.writeHead(404);
    res.end('Not Found');
})

// Create web-sockets
const wss = new WebSocketServer({ server })
const roomsCache = new Map();

// joining at the same millisecond never overwrite roomsCache with separate client Sets.
const pendingLoads = new Map();
async function getOrLoadRoom(roomId) {

    if (roomsCache.has(roomId)) {
        return roomsCache.get(roomId);
    }

    if (pendingLoads.has(roomId)) {
        return pendingLoads.get(roomId);
    }

    const loadPromise = (async () => {
        await ensureRoom(roomId);
        const { nodes, connections } = await getRoomState(roomId);
        const room = { clients: new Set(), nodes, connections };
        roomsCache.set(roomId, room);
        return room;
    })().finally(() => {
        pendingLoads.delete(roomId);
    });
    
    pendingLoads.set(roomId, loadPromise);
    return loadPromise;
}





// Turn web-socket on when any user joins
// socket: one specific device, user or connection (on, send, w)
wss.on('connection', async (socket, request) => {
    const parsedUrl = new URL(request.url, 'http://localhost:8080');
    const roomId = parsedUrl.searchParams.get('room');
    const userId = parsedUrl.searchParams.get('userId') || 'anon';


    console.log(`User ${userId} connected to room ${roomId}`);


    // Add sockets to rooms and share the empty arrays or
    //  existing data in the room with new sockets
    const room = await getOrLoadRoom(roomId);
    if (socket.readyState !== 1) return;
    room.clients.add(socket);

    // sending a message fromm the server to  the new socket/user
    socket.send(
        JSON.stringify({
            type: 'init_room',
            nodes: room.nodes,
            connections: room.connections
        })
    )


    // Broadcasts messages to all other users in the room when someone sends/adds something.
    socket.on('message', (data) => {
        const message = data.toString()

        try {

            const parsed = JSON.parse(message)

            switch(parsed.type) {

                    case 'nodes_added':
                        room.nodes.push(...parsed.nodes)
                        console.log(roomId, ...parsed.nodes)
                        addNodes(roomId, parsed.nodes).catch(console.error);
                        break;

                    case 'node_moved': {
                        const node = room.nodes.find((n) => n.id === parsed.id)
                        if(node) {
                            node.x = parsed.x
                            node.y = parsed.y
                            moveNode(parsed.id, parsed.x, parsed.y).catch(console.error);
                        }
                        break;
                    }

                    case 'node_deleted':
                        room.nodes = room.nodes.filter((n) => n.id !== parsed.nodeId)
                        room.connections = room.connections.filter(
                            (c) => c.fromNodeId !== parsed.nodeId && c.toNodeId !== parsed.nodeId)
                        deleteNode(parsed.nodeId).catch(console.error);
                        break;

                    case 'edge_added':
                        room.connections.push(parsed.connection)
                        addConnection(roomId, parsed.connection).catch(console.error);
                        break;

                    case 'edge_deleted':
                        room.connections = room.connections.filter((c) => c.id !== parsed.edgeId)
                        deleteConnection(parsed.edgeId).catch(console.error);
                        break;
              }

        } catch(err) {
            console.log(err)
        }

        for (const client of room.clients) {
            if (client !== socket && client.readyState === 1) {
            client.send(message);
            }
        }

    });

// controls what happens when user leaves/socket closes
    socket.on('close', () => {
    room.clients.delete(socket);

    const message = JSON.stringify({
        type: 'user_left',
        userId: userId,
    })

    for (const client of room.clients) {
        if (client !== socket && client.readyState === 1) {
            client.send(message);
        }
    }
    console.log(`User ${userId} left room ${roomId}`);

    if (room.clients.size === 0) {
        roomsCache.delete(roomId);
    }
    });

});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});