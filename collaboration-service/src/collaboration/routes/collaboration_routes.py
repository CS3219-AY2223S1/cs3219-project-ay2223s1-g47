from multiprocessing import connection

from src.collaboration.services.room_crud_services import RoomCrudService
from src.db.db import db
from src.collaboration.interfaces.room_state import RoomState
from src.collaboration.interfaces.user import User
from src.collaboration.room_connection_manager import RoomConnectionManager, global_room_connection_store
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query

router = APIRouter()

router.websocket("/room/")
async def room_socket(websocket: WebSocket, user: User, room_id: str = Query(None)):
    # 1. create connection manager
    connection_manager = global_room_connection_store.get(room_id)
    if connection_manager is None:
        connection_manager = RoomConnectionManager(room_id, RoomCrudService(db))
        global_room_connection_store[room_id] = connection_manager

    # authenticate user 
    await connection_manager.initialize()
    
    # add user to room (same socket connection)
    

    # 2. loop
    while True:
        try: 
        
            # receieve frontend state as json
            activity_state = RoomState(**await websocket.receive_json())

            # pass to connection manager to handle

            
        except WebSocketDisconnect:
            # disconnect user from room
            pass
            
                         