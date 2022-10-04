from typing import List

from src.collaboration.services.room_crud_services import RoomCrudService
from src.api.question_service_api import QuestionServiceApiHandler
from src.collaboration.interfaces.room import Room
from src.constants import ROOM_TABLE_NAME


class CrudManager:
    """
    Responsible for crud operations on the rooms table 
    in the collaboration service database.
    """

    def __init__(self, crud_service: RoomCrudService, question_service: QuestionServiceApiHandler):
        self.crud_service = crud_service
        self.question_service = question_service

    async def create_room(self, user1_id: str, user2_id: str, difficulty: int) -> Room:
        """
        Creates a new room in db and sets a worker to close the room after some predefined time.
        """
        # 1. asynchronously ask for a question for question service

        # 2. create object

        # 3. insert into db

        # 4. schedule an async cleanup job

        # 5. return room object



    def get_room_history(user_id: str) -> List[Room]:
        """
        Given the user id, returns a history of rooms up to a certain date.
        """
        # 1. query db, using userid as index as user1

        # 2. query db, using userid as index as user2

        # 3. join the two results


        
