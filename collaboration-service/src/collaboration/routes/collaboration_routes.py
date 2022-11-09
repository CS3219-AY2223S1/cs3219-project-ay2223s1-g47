
from src.jwt.route_dependencies import jwt_auth_from_query
from src.collaboration.services.room_crud_services import RoomCrudService
from src.db.db import db
from src.collaboration.interfaces.room_state import RoomState
from src.collaboration.interfaces.user import User
from src.collaboration.room_connection_manager import RoomConnectionManager, global_room_connection_store
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, Depends


router = APIRouter()

@router.websocket("/room")
async def room_socket(websocket: WebSocket, room_id: str = Query(default=""), user: User = Depends(jwt_auth_from_query)):

    print(f"User {user.id} trying to connect to room {room_id}")

    # 1. create connection manager
    room_manager = global_room_connection_store.get(room_id)
    if room_manager is None:
        print("no manager, creating new one")
        room_manager = RoomConnectionManager(room_id, RoomCrudService(db))
        global_room_connection_store[room_id] = room_manager
    

    # iinitialize 
    await room_manager.initialize(user, websocket)
    print("sockets in room: ", room_manager.active_connections)

    # 2. loop
    while True:
        try: 
            # receieve frontend state as json
            frontend_state = await websocket.receive_json()
            print(f"Recieving message from user {user.id} in room {room_id}, message: {frontend_state}")
            activity_state = RoomState.from_frontend_state(frontend_state)

            # pass to connection manager to handle
            await room_manager.update_room_state(user, activity_state)

            
        except WebSocketDisconnect:
            print(f"User {user.id} disconnected from room {room_id}")
            # disconnect user from room
            await room_manager.disconnect_user(user)
            print("Closing websocket.")
            break
    
            
                         