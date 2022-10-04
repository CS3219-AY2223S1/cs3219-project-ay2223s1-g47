from typing import List

from src.collaboration.exceptions import CrudException

from src.collaboration.interfaces.question import Question
from src.collaboration.interfaces.room import Room
from src.collaboration.interfaces.room_state import RoomState
from src.collaboration.models.room import RoomModel

from src.constants import CLEANUP_TIMEOUT_IN_SECONDS, ROOM_TABLE_NAME
from src.db.db import db, DatabaseWrapper

from datetime import datetime
from uuid import uuid4

import time
import logging

class RoomCrudService:
    """
    Responsible for crud operations on the rooms table 
    in the collaboration service database.
    """

    def __init__(self, _db: DatabaseWrapper):
        self.db = _db if _db is not None else db
        self.table = ROOM_TABLE_NAME

    def create_room(self, user1_id: str, user2_id: str, question: Question, _room_id: str = None) -> Room:
        """
        Creates a new room in db and sets a worker to close the room after some predefined time.
        """
        logging.debug("Creating room in db ...")

        # 1. create object
        room_initial_state = RoomState(
            code = "", # no code
            chat_history = [] # no history
        )
        room_model = RoomModel(
            room_id = _room_id or str(uuid4()),
            created_at = str(datetime.now()),
            closed_at = None,
            is_closed = False,
            state = room_initial_state,
            num_in_room=0,
            user1_id = user1_id,
            user2_id = user2_id,
            question = question,
            question_id=question.question_id
        )

        # 2. check that object isn't inside
        if len([r for r in self.db.get_items(self.table, dict(room_id=room_model.room_id))]) > 0:
            raise CrudException("Room already exists in db.")

        # 3. insert into db
        self.db.insert(self.table, room_model.dict())

        # 4. schedule an async cleanup job
        logging.debug("Scheduling cleanup ...")
        RoomCrudService.handle_room_cleanup(timeout_in_seconds=CLEANUP_TIMEOUT_IN_SECONDS, room_id=room_model.room_id, db=self.db)

        # 5. return room object
        room = Room.from_room_model(room_model)
        return room


    @staticmethod
    async def handle_room_cleanup(timeout_in_seconds: int, room_id: str, db: DatabaseWrapper):
        """
        Sleeps, then checks if the room is empty. If it is, it closes the room. 
        """
        # sleep for timeout_in_seconds
        time.sleep(timeout_in_seconds)

        # get from db
        logging.debug("Checking if room is empty ...")
        rooms = db.get_items(ROOM_TABLE_NAME, dict(room_id=room_id))
        if len(rooms) == 0:
            raise CrudException("Room not found in db.")
        elif len(rooms) > 1:
            raise CrudException("Multiple rooms found in db.")
        room = rooms[0] # we have exactly one room (as expected)
        room_as_model = RoomModel(**room)

        # check if room is empty. if empty, close. else, do nothing.
        if room_as_model.num_in_room == 0 and not room_as_model.is_closed:
            # update state
            room_as_model.is_closed = True

            # push to db
            key = [dict(room_id=room_id)]
            db.update_item(ROOM_TABLE_NAME, key, room_as_model)
            logging.debug(f"Room {room_id} closed.")
        else:
            # do nothing
            logging.debug("Room is not empty. Doing nothing.")
        

    def get_room_by_id(self, room_id:str) -> Room:
        """
        Given the room id, returns the room object.
        """
        # 1. query db, using room_id as index
        rooms = [r for r in self.db.get_items(self.table, dict(room_id=room_id))]
        if len(rooms) == 0:
            raise CrudException("Room not found in db.")
        elif len(rooms) > 1:
            raise CrudException("Multiple rooms found in db.")
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


        
