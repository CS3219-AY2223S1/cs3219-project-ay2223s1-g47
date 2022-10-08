import asyncio
import logging
from typing import Dict, List

from src.collaboration.interfaces.events import ChatRoomEvent, ChatRoomEventType

from src.constants import CLEANUP_TIMEOUT_IN_SECONDS
from src.collaboration.interfaces.user import User
from src.collaboration.interfaces.room_state import RoomState
from src.collaboration.interfaces.room import Room
from src.collaboration.services.room_crud_services import RoomCrudService
from src.collaboration.exceptions import RoomConnectionException, RoomEntryNotAuthorizedException, RoomNotFoundException
from fastapi import WebSocket

import time



class RoomConnectionManager:

    def __init__(self, room_id: str, crud_service: RoomCrudService):
        self.active_connections: Dict[str, WebSocket] = dict() # userid -> socket
        self.crud_service = crud_service
        self.room_id = room_id
        self.room: Room = None

    async def initialize(self, user: User,  websocket: WebSocket):
        """
        Initilaizes the room connection manager. 
        - Checks if the room exists
        - Checks if the user is authorized to enter the room
        - Checks if the room is closed
        """
        # get room from db if needed
        if self.room is None:
            self.room = self.crud_service.get_room_by_id(self.room_id)
            if self.room is None:
                raise RoomNotFoundException("Room does not exist")

        # check that user is allowed to join room
        allowed_users_ids = [self.room.user1_id, self.room.user2_id]
        if user.id not in allowed_users_ids:
            raise RoomEntryNotAuthorizedException("User not allowed in room.")

        # check that room is not closed
        if self.room.is_closed:
            raise RoomConnectionException("Room already closed, cannot enter.", detail = self.room)

        # add socket to room
        await self.add_socket_to_room(user.id, websocket)

        # # send message 
        # connected_event = ChatRoomEvent(
        #     user_ids = [user.id],
        #     message = f"{user.username} has joined the room.",
        #     event_type = ChatRoomEventType.USER_JOIN
        # )
        
        # for connection in self.active_connections.values():
        #     await connection.send_json(self.room.dict())

    async def add_socket_to_room(self, id: str, websocket: WebSocket):
        """
        Takes in a websocket object and adds it to the list of active connections.
        """
        
        # close existing connection if exists
        if id in self.active_connections:
            await self.active_connections.pop(id).close()
            

        # add connection
        self.active_connections[id] = websocket
        await websocket.accept()

        # update state
        self.room.num_in_room += 1

        # save to db
        self.crud_service.update_room(self.room)

    async def disconnect_user(self, user: User):
        """
        Disconnects a user from the room.
        """
        # remove socket from room
        await self.remove_socket_from_room(user.id)

        # # send message 
        # disconnected_event = ChatRoomEvent(
        #     user_ids = [user.id],
        #     message = f"{user.username} has left the room.",
        #     event_type = ChatRoomEventType.USER_LEFT
        # )
        # for connection in self.active_connections.values():
        #     await connection.send_json(self.room.dict())
        

    async def remove_socket_from_room(self, id: str):
        """
        Removes a websocket object from the list of active connections.
        """
        # 1. remove
        print(self.active_connections)
        if id in self.active_connections:
            websocket = self.active_connections.pop(id)
        print(self.active_connections)

        # 2. update state
        self.room.num_in_room -= 1
        if self.room.num_in_room == 0: # empty room
            # start async worker to close room in timeout
            self.handle_cleanup(CLEANUP_TIMEOUT_IN_SECONDS)

        # 3. push to db
        self.crud_service.update_room(self.room)



    async def update_room_state(self, room_state: RoomState):
        """
        Updates the room state in the database.
        """
        # check
        if room_state == self.room.state:
            return

        # update tracked state
        self.room.state = room_state
        print("updating room state", self.room.state)

        # update db
        self.crud_service.update_room(self.room)

        # publish to all sockets
        
        for id, connection in self.active_connections.items():
            print("sending to socket", id)
            await connection.send_json(self.room.dict())
    
    async def handle_cleanup(self, timeout_in_seconds: int):
        """
        Handles the cleanup of the room after a timeout.
        """
        
        # sleep for timeout_in_seconds
        time.sleep(timeout_in_seconds)

        # check if room is empty. if empty, close. else, do nothing.
        if self.room.num_in_room == 0 and not self.room.is_closed and len(self.active_connections) == 0:
            self.room.is_closed = True
            await self.crud_service.update_room(self.room)
            logging.debug(f"Room {self.room.room_id} closed.")
        del self # cleanup

global_room_connection_store: Dict[str, RoomConnectionManager] = dict() # room id -> room connection manager