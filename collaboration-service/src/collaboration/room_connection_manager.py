from typing import Dict, List
from fastapi import WebSocket
from three_merge import merge

from src.collaboration.interfaces.events import ChatRoomEvent, ChatRoomEventType
from src.collaboration.interfaces.user import User
from src.collaboration.interfaces.room_state import RoomState
from src.collaboration.interfaces.room import Room
from src.collaboration.services.room_crud_services import RoomCrudService
from src.collaboration.exceptions import RoomEntryNotAuthorizedException, RoomNotFoundException



import time



class RoomConnectionManager:

    def __init__(self, room_id: str, crud_service: RoomCrudService):
        self.active_connections: Dict[str, WebSocket] = dict() # userid -> socket
        self.crud_service = crud_service
        self.room_id = room_id
        self.room: Room = None
        self.user_states: Dict[str, RoomState] = dict() # userid -> room state

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

        # add socket to room
        await self.add_socket_to_room(user.id, websocket)

        # publish join room event
        join_event = ChatRoomEvent(
            event_type=ChatRoomEventType.USER_JOIN,
            user_ids=[user.id],
            message=f"{user.username} joined the room.",
            timestamp=time.time()
        )

        # update state
        self.room.num_in_room += 1
        self.room.events.append(join_event)

        # merge room states
        self.merge_room_states()

        # send room state to user
        await self.publish_room_excluding([])

        # save to db
        self.crud_service.update_room(self.room)

    async def publish_room_to(self, include_ids: List[str]):
        """
        Publishes a room to specified sockets.
        """

        # publish to sockets
        for id, connection in self.active_connections.items():
            if id in include_ids:
                await connection.send_json(self.room.dict())
    
    async def publish_room_excluding(self, exclude_ids: List[str]):
        """
        Publishes a room to all sockets except the specified ones.
        """

        # publish to sockets
        for id, connection in self.active_connections.items():
            if id not in exclude_ids:
                await connection.send_json(self.room.dict())

    def merge_room_states(self): 
        """
        Merges the room states of the two users into one.
        """
        # merge room code
        print("merging room states")
        user1_id = self.room.user1_id
        if user1_id not in self.user_states: 
            self.user_states[user1_id] = self.room.state
        user2_id = self.room.user2_id
        if user2_id not in self.user_states: 
            self.user_states[user2_id] = self.room.state
        
        print("before merge")
        print(self.user_states[user1_id].dict(), self.user_states[user2_id].dict(), self.room.state.dict())
        # self.room.state.code = merge(self.user_states[user1_id].code, self.user_states[user2_id].code, self.room.state.code)
        print("after merge")
        print(self.user_states[user1_id].dict(), self.user_states[user2_id].dict(), self.room.state.dict())

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

        

    async def disconnect_user(self, user: User):
        """
        Disconnects a user from the room.
        """
        # remove socket from room
        await self.remove_socket_from_room(user.id)

        # publish join room event
        leave_event = ChatRoomEvent(
            event_type=ChatRoomEventType.USER_LEFT,
            user_id=user.id,
            room_id=self.room_id,
            timestamp=time.time()
        )

        # update state
        self.room.num_in_room -= 1
        self.room.events.append(leave_event)

        # merge room states
        self.merge_room_states()

        # send room state to user
        await self.publish_room_excluding([user.id], self.room)

        # save to db
        self.crud_service.update_room(self.room)
        

    async def remove_socket_from_room(self, id: str):
        """
        Removes a websocket object from the list of active connections.
        """
        print(self.active_connections)
        if id in self.active_connections:
            websocket = self.active_connections.pop(id)
        print(self.active_connections)



    async def update_room_state(self, user: User, room_state: RoomState):
        """
        Updates the room state in the database.
        """
        # check
        if room_state == self.room.state:
            return

        # update user state
        self.user_states[user.id] = room_state
        print("updating room state from user", user.id , room_state)

        # merge room states
        self.merge_room_states()

        # update db
        self.crud_service.update_room(self.room)

        # publish to all sockets
        for id, connection in self.active_connections.items():
            print("sending to socket", id)
            # await connection.send_json(self.room.dict())


global_room_connection_store: Dict[str, RoomConnectionManager] = dict() # room id -> room connection manager