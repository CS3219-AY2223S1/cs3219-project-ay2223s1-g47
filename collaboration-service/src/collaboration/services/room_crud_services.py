from typing import List

from src.exceptions import CrudException, CrudItemNotFoundException

from src.collaboration.interfaces.question import Question
from src.collaboration.interfaces.room import Room
from src.collaboration.interfaces.room_state import RoomState
from src.collaboration.models.room import RoomModel

from src.constants import ROOM_TABLE_NAME
from src.db.db import db, DatabaseWrapper

from datetime import datetime
from uuid import uuid4

import logging

class RoomCrudService:
    """
    Responsible for crud operations on the rooms table 
    in the collaboration service database.
    """

    def __init__(self, _db: DatabaseWrapper):
        self.db = _db if _db is not None else db
        self.table = ROOM_TABLE_NAME

    def create_room(self, user1_id: str, username1: str, user2_id: str, username2: str, question: Question, _room_id: str = None) -> Room:
        """
        Creates a new room in db and sets a worker to close the room after some predefined time.
        """
        logging.debug("Creating room in db ...")

        # 1. create object
        room_initial_state = RoomState(
            code = "", # no code
        )
        room_model = RoomModel(
            room_id = _room_id or str(uuid4()),
            created_at = str(datetime.now()),
            state = room_initial_state,
            num_in_room=0,
            user1_id = user1_id,
            username1 = username1,
            user2_id = user2_id,
            username2 = username2,
            question = question,
            question_id=question.qid,
            events=[] # no events
        )

        # 2. check that object isn't inside
        if len([r for r in self.db.get_items(self.table, dict(room_id=room_model.room_id))]) > 0:
            raise CrudException("Room already exists in db.")

        # 3. insert into db
        self.db.insert(self.table, room_model.dict())

        # 4. return room object
        room = Room.from_room_model(room_model)
        return room


     

    def get_room_by_id(self, room_id:str) -> Room:
        """
        Given the room id, returns the room object.
        """
        # 1. query db, using room_id as index
        rooms = [r for r in self.db.get_items(self.table, dict(room_id=room_id))]
        if len(rooms) == 0:
            raise CrudItemNotFoundException("Room not found!")
        elif len(rooms) > 1:
            raise CrudException("Multiple rooms found! This should not happen for a specific id.")
        room = rooms[0] # we have exactly one room (as expected)
        room = Room(**room)
        return room


    def update_room(self, room: Room):
        """
        Updates the room state in the database.
        """
        # convert to model
        room_as_model = RoomModel(**room.dict())

        # push to db
        key = dict(room_id=room.room_id)
        self.db.update_item(self.table, key, room_as_model.dict())
        


    def get_room_history(self, user_id: str) -> List[Room]:
        """
        Given the user id, returns a history of rooms up to a certain date.
        """
        # 1. query db, using userid as index as user1
        rooms = [Room.from_room_model(RoomModel(**i)) for i in self.db.get_items(self.table, dict(user1_id=user_id))]

        # 2. query db, using userid as index as user2
        rooms += [Room.from_room_model(RoomModel(**i)) for i in self.db.get_items(self.table, dict(user2_id=user_id))]

        # 3. join the two results
        return rooms


        
