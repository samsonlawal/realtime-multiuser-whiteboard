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
            `SELECT id, primitive_id AS "primitiveId", label, category, icon, color,
                    fill, stroke_width AS "strokeWidth", stroke_style AS "strokeStyle", opacity,
                    x, y
             FROM nodes WHERE room_id = $1`,
            [roomId]
        ),
        pool.query(
            `SELECT id, from_node_id AS "fromNodeId", from_port AS "fromPort",
                    to_node_id AS "toNodeId", to_port AS "toPort",
                    color, stroke_width AS "strokeWidth", style, direction, opacity
             FROM connections WHERE room_id = $1`,
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
                `INSERT INTO nodes (id, room_id, primitive_id, label, category, icon, color, fill, stroke_width, stroke_style, opacity, x, y)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                 ON CONFLICT (id) DO NOTHING`,
                [
                    node.id,
                    roomId,
                    node.primitiveId,
                    node.label,
                    node.category,
                    node.icon ?? null,
                    node.color ?? null,
                    node.fill ?? null,
                    node.strokeWidth ?? null,
                    node.strokeStyle ?? null,
                    node.opacity ?? 100,
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

/** Update a node's style and properties in Postgres. */
export async function updateNode(node) {
    await pool.query(
        `UPDATE nodes
         SET color = $1, fill = $2, stroke_width = $3, stroke_style = $4, opacity = $5, label = $6, x = $7, y = $8
         WHERE id = $9`,
        [
            node.color ?? null,
            node.fill ?? null,
            node.strokeWidth ?? null,
            node.strokeStyle ?? null,
            node.opacity ?? 100,
            node.label,
            node.x,
            node.y,
            node.id,
        ]
    );
}

/** Delete a node (attached connections cascade automatically via FK). */
export async function deleteNode(nodeId) {
    await pool.query('DELETE FROM nodes WHERE id = $1', [nodeId]);
}

/** Persist a newly created wire connection between two node ports. */
export async function addConnection(roomId, connection) {
    await pool.query(
        `INSERT INTO connections (id, room_id, from_node_id, from_port, to_node_id, to_port, color, stroke_width, style, direction, opacity)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO NOTHING`,
        [
            connection.id,
            roomId,
            connection.fromNodeId,
            connection.fromPort,
            connection.toNodeId,
            connection.toPort,
            connection.color ?? null,
            connection.strokeWidth ?? 2,
            connection.style ?? 'solid',
            connection.direction ?? 'unidirectional',
            connection.opacity ?? 100,
        ]
    );
}

/** Update a connection's style and properties in Postgres. */
export async function updateConnection(connection) {
    await pool.query(
        `UPDATE connections
         SET color = $1, stroke_width = $2, style = $3, direction = $4, opacity = $5
         WHERE id = $6`,
        [
            connection.color ?? null,
            connection.strokeWidth ?? 2,
            connection.style ?? 'solid',
            connection.direction ?? 'unidirectional',
            connection.opacity ?? 100,
            connection.id,
        ]
    );
}

/** Delete a single wire connection by ID. */
export async function deleteConnection(edgeId) {
    await pool.query('DELETE FROM connections WHERE id = $1', [edgeId]);
}


