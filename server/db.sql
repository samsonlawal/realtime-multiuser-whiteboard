
-- 1. Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Nodes Table (Cards on the Canvas)
CREATE TABLE IF NOT EXISTS nodes (
    id TEXT PRIMARY KEY,
    room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    primitive_id TEXT NOT NULL,
    label TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    x DOUBLE PRECISION NOT NULL,
    y DOUBLE PRECISION NOT NULL
);

-- 3. Connections Table (Bezier Wires between Cards)
CREATE TABLE IF NOT EXISTS connections (
    id TEXT PRIMARY KEY,
    room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    from_node_id TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    from_port TEXT NOT NULL,
    to_node_id TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    to_port TEXT NOT NULL,
    color TEXT,
    style TEXT DEFAULT 'solid'
);

-- 4. Indexes for Fast Room Lookups
CREATE INDEX IF NOT EXISTS idx_nodes_room_id ON nodes(room_id);
CREATE INDEX IF NOT EXISTS idx_connections_room_id ON connections(room_id);

