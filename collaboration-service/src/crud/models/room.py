from src.db.interfaces import DatabaseIndexWrapper
from src.crud.interfaces.question import Question
from src.db.db import db
from pydantic import BaseModel

import pymongo

class RoomModel(BaseModel):
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


# ====== indices =======
# index to access by room id
access_by_room_id = DatabaseIndexWrapper(
    collection_name="rooms",
    index_name="room_id",
    index_fields=["room_id", pymongo.ASCENDING],
    sparse = True
)

# index to access by user1 id
access_by_user1_id = DatabaseIndexWrapper(
    collection_name="rooms",
    index_name="user1_id",
    index_fields=["user1_id", pymongo.ASCENDING],
    sparse = True
)

# index to access by user1 id
access_by_user2_id = DatabaseIndexWrapper(
    collection_name="rooms",
    index_name="user2_id",
    index_fields=["user2_id", pymongo.ASCENDING],
    sparse = True
)

INDICES = [
    access_by_room_id,
    access_by_user1_id,
    access_by_user2_id
]
for idx in INDICES:
    db.create_index(idx)
