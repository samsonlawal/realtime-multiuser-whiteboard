import pool from './db.js';

/** Insert a new room row explicitly and return it. */
export async function createRoom(roomId) {
    const newRoom = await pool.query('INSERT INTO rooms (id) VALUES ($1) RETURNING *', [roomId]);
    return newRoom.rows[0];
}

/** Ensure a room exists in Postgres before writing nodes or connections to it. */
export async function ensureRoom(roomId) {
    await pool.query('INSERT INTO rooms (id) VALUES ($1) ON CONFLICT (id) DO NOTHING', [roomId]);
}

/** Fetch all persisted nodes and connections for a room in camelCase shape. */
export async function getRoomState(roomId) {
    const [nodesData, connectionsData] = await Promise.all([
        pool.query(
            'SELECT id, primitive_id AS "primitiveId", label, category, icon, color, x, y FROM nodes WHERE room_id = $1',
            [roomId]
        ),
        pool.query(
            'SELECT id, from_node_id AS "fromNodeId", from_port AS "fromPort", to_node_id AS "toNodeId", to_port AS "toPort", color, style FROM connections WHERE room_id = $1',
            [roomId]
        ),
    ]);

    return {
        nodes: nodesData.rows,
        connections: connectionsData.rows,
    };
}

/** Persist one or more newly added nodes for a room. */
export async function addNodes(roomId, nodes) {
    if (!nodes || nodes.length === 0) {
        console.log("no nodes added")

        return
    };

    await Promise.all(
        nodes.map((node) =>
            pool.query(
                `INSERT INTO nodes (id, room_id, primitive_id, label, category, icon, color, x, y)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                 ON CONFLICT (id) DO NOTHING`,
                [
                    node.id,
                    roomId,
                    node.primitiveId,
                    node.label,
                    node.category,
                    node.icon ?? null,
                    node.color ?? null,
                    node.x,
                    node.y,
                ]
            )
        )
    );
}

/** Update a node's coordinates in Postgres. */
export async function moveNode(nodeId, x, y) {
    await pool.query('UPDATE nodes SET x = $1, y = $2 WHERE id = $3', [x, y, nodeId]);
}

/** Delete a node (attached connections cascade automatically via FK). */
export async function deleteNode(nodeId) {
    await pool.query('DELETE FROM nodes WHERE id = $1', [nodeId]);
}

/** Persist a newly created wire connection between two node ports. */
export async function addConnection(roomId, connection) {
    await pool.query(
        `INSERT INTO connections (id, room_id, from_node_id, from_port, to_node_id, to_port, color, style)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO NOTHING`,
        [
            connection.id,
            roomId,
            connection.fromNodeId,
            connection.fromPort,
            connection.toNodeId,
            connection.toPort,
            connection.color ?? null,
            connection.style ?? 'solid',
        ]
    );
}

/** Delete a single wire connection by ID. */
export async function deleteConnection(edgeId) {
    await pool.query('DELETE FROM connections WHERE id = $1', [edgeId]);
}
