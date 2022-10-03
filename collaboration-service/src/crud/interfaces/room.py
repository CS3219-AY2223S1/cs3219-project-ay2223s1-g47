from src.db.interfaces import DatabaseIndexWrapper
from src.crud.interfaces.question import Question
from src.db.db import db
from pydantic import BaseModel

class Room(BaseModel):
    """
    The model schema we use to save rooms in the db. 
    We distinguish between this and interfaces - as interfaces are inttended
    to be lighter-weight versions we use within the backend.
    """
    # ====== room data ======
    room_id: str # room id
    created_at: str # created at
    closed_at: str # closed at
    is_closed: bool # is closed

    # ====== user 1 ======
    user1_id: str
    user1_in_room: bool # user 1 in room
    
    # ====== user 2 ======
    user2_id: str
    user2_in_room: bool # user 2 in room

    # ====== question ======
    question_id: str # question id
    question: Question # question

