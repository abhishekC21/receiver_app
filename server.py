server.py

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import List

app = FastAPI()

clients: List[WebSocket] = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)

    print("Client connected. Total:", len(clients))

    try:
        while True:
            data = await websocket.receive_text()
            print("Received:", data)

            # Broadcast to others
            for client in clients:
                if client != websocket:
                    await client.send_text(data)

    except WebSocketDisconnect:
        clients.remove(websocket)
        print("Client disconnected. Total:", len(clients))
