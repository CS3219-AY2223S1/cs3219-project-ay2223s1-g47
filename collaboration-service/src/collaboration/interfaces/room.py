from src.collaboration.models.room import RoomModel
from src.collaboration.interfaces.room_state import RoomState
from src.collaboration.interfaces.question import Question
from src.db.db import db
from pydantic import BaseModel

class RoomMetadata(BaseModel):
    """
    Metadata about a room.
    """

    room_id: str # room id
    created_at: str # created at
    closed_at: str # closed at
    is_closed: bool # is closed
    state: RoomState # state of room
    num_in_room: int # number in room


class Room(RoomMetadata):
    """
    The room interface we use in the backend. Note that it 
    inherits from the room metadata interface.
    """

    # ====== user 1 ======
    user1_id: str
    
    # ====== user 2 ======
    user2_id: str

    # ====== question ======
    question_id: str # question id
    question: Question # question

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

    @staticmethod
    def from_room(room: Room):
        return RoomInResponse(
            room_id=room.room_id,
            created_at=room.created_at,
            closed_at=room.closed_at,
            is_closed=room.is_closed,
            state=room.state,
            num_in_room=room.num_in_room,
            question=room.question
        )
