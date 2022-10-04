from typing import List

from src.collaboration.interfaces.room import Room
from src.constants import ROOM_TABLE_NAME
from src.db.db import db, DatabaseWrapper


class RoomCrudService:
    """
    Responsible for crud operations on the rooms table 
    in the collaboration service database.
    """

    def __init__(self, _db: DatabaseWrapper):
        self.db = _db if _db is not None else db
        self.table = ROOM_TABLE_NAME

    async def create_room(self, user1_id: str, user2_id: str, difficulty: int) -> Room:
        """
        Creates a new room in db and sets a worker to close the room after some predefined time.
        """
        # 1. asynchronously ask for a question for question service

        # 2. create object

        # 3. insert into db

        # 4. schedule an async cleanup job

        # 5. return room object

    async def get_room_by_id(self, room_id:str) -> Room:
        """
        Given the room id, returns the room object.
        """
        # 1. query db, using room_id as index

    async def update_room(self, room: Room):
        """
        Updates the room state in the database.
        """
        # convert to model

        # push to db
        


    def get_room_history(user_id: str) -> List[Room]:
        """
        Given the user id, returns a history of rooms up to a certain date.
        """
        # 1. query db, using userid as index as user1

        # 2. query db, using userid as index as user2

        # 3. join the two results


        
