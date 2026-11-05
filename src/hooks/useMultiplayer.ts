import { useEffect, useRef, useState } from 'react';


export interface RemotePeer {
  userId: string;
  name?: string;
  color: string;
  cursor: { x: number; y: number } | null;
}

export function useMultiplayer(roomId: string | undefined) {
    const [peers, setPeers] = useState<Record<string, RemotePeer>>({});
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);

    const [myUserId] = useState(() => {
    let id = localStorage.getItem('canvas_device_id');
    if (!id) {
        id = `user-${crypto.randomUUID().slice(0, 5)}`;
        localStorage.setItem('canvas_device_id', id);
    }
    return id;
    });

        useEffect(() => {
        if (!roomId) return;

        const socket = new WebSocket(`ws://localhost:8080?room=${roomId}&userId=${myUserId}`);
        socketRef.current = socket;
        
        socket.onopen = () => {
        console.log(`[Multiplayer] Connected to room: ${roomId}`);
        setIsConnected(true);
        };

        socket.onmessage = (event) => {
            try{
                const data = JSON.parse(event.data)

                if(data.type === 'cursor_move') {
                    setPeers((prev) => ({
                        ...prev,
                        [data.userId]: {
                            userId: data.userId,
                            name: data.userId,
                            color: data.color || '#3b82f6',
                            cursor: { x: data.x, y: data.y },
                        }
                    }))
                }

            } catch (err) {
                console.error('[Multiplayer] Failed to parse message:', err);    
            }
        } 

        socket.onclose = () => {
        console.log('[Multiplayer] Disconnected from server');
        setIsConnected(false);
        };

        return () => {
        socket.close();
        socketRef.current = null;
        };
    }, [roomId]);

    const broadcastCursor = (x: number, y: number) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    socket.send(
        JSON.stringify({
        type: 'cursor_move',
        userId: myUserId,
        x: Math.round(x),
        y: Math.round(y),
        })
    );
    };


    return { isConnected, peers, broadcastCursor  };

// 1. takes the roomId
// 2. list of remote users(name id color and cursior coordinates)

}


// Build like a modal like t he YT share one that helps select
//  perimisons for the type of shring of llink
//  to dtermine ehat the user can do and invitations.