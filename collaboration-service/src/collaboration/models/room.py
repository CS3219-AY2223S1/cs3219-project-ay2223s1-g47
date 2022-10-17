from typing import List, Optional

from src.collaboration.interfaces.events import ChatRoomEvent
from src.collaboration.interfaces.room_state import RoomState
from src.db.interfaces import DatabaseIndexWrapper
from src.collaboration.interfaces.question import Question
from src.db.db import db
from pydantic import BaseModel

import pymongo
import logging

class RoomModel(BaseModel):
    """
    The model schema we use to save rooms in the db. 
    We distinguish between this and interfaces - as interfaces are inttended
    to be lighter-weight versions we use within the backend.
    """
    # ====== room data ======
    room_id: str # room id
    created_at: str # created at
    state: RoomState # state of room
    num_in_room: int # number in room

    # ====== user 1 ======
    user1_id: str
    
    # ====== user 2 ======
    user2_id: str

    # ====== question ======
    question_id: str # question id
    question: Question # question

    # ====== history =======
    events: List[ChatRoomEvent]


# ====== indices =======
# index to access by room id
access_by_room_id = DatabaseIndexWrapper(
    collection_name="rooms",
    index_name="room_id",
    index_fields=[("room_id", pymongo.ASCENDING)],
    sparse = True
)

# index to access by user1 id
access_by_user1_id = DatabaseIndexWrapper(
    collection_name="rooms",
    index_name="user1_id",
    index_fields=[("user1_id", pymongo.ASCENDING)],
    sparse = True
)

# index to access by user1 id
access_by_user2_id = DatabaseIndexWrapper(
    collection_name="rooms",
    index_name="user2_id",
    index_fields=[("user2_id", pymongo.ASCENDING)],
    sparse = True
)

INDICES = [
    access_by_room_id,
    access_by_user1_id,
    access_by_user2_id
]
for idx in INDICES:
    logging.debug(f"Creating index: {idx.index_name}")
    db.create_index(idx)
