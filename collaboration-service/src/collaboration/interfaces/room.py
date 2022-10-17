from typing import List

from src.collaboration.interfaces.events import ChatRoomEvent
from src.collaboration.models.room import RoomModel
from src.collaboration.interfaces.room_state import RoomState
from src.collaboration.interfaces.question import Question
from src.db.db import db
from pydantic import BaseModel

class RoomMetadata(BaseModel):
    """
    Metadata about a room.
    """
    # ====== room info ======
    room_id: str # room id
    created_at: str # created at
    state: RoomState # state of room
    num_in_room: int # number in room

    # ====== user 1 ======
    user1_id: str
    username1: str
    
    # ====== user 2 ======
    user2_id: str
    username2: str


class Room(RoomMetadata):
    """
    The room interface we use in the backend. Note that it 
    inherits from the room metadata interface.
    """

    # ====== question ======
    question_id: str # question id
    question: Question # question

    # ====== history =======
    events: List[ChatRoomEvent]

    @staticmethod
    def from_room_model(room_model: RoomModel):
        
        # 1. convert to room
        room = Room(**room_model.dict())

        # 2. return room
        return room

class RoomInResponse(RoomMetadata):
    """
    The room interface we will expose to the frontend. Note that it 
    inherits from the room metadata interface.
    """

    question: Question
    events: List[ChatRoomEvent]

    @staticmethod
    def from_room(room: Room):
        return RoomInResponse(
            user1_id=room.user1_id,
            username1=room.username1,
            user2_id=room.user2_id,
            username2=room.username2,
            room_id=room.room_id,
            created_at=room.created_at,
            state=room.state,
            num_in_room=room.num_in_room,
            question=room.question,
            events=room.events,
        )
