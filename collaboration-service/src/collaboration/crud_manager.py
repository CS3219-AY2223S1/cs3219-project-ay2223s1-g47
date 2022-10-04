from typing import List

from src.collaboration.services.room_crud_services import RoomCrudService
from src.api.question_service_api import QuestionServiceApiHandler
from src.collaboration.interfaces.room import Room


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
        question = await self.question_service.get_question(difficulty)

        # 2. create object
        room = await self.crud_service.create_room(user1_id, user2_id, question)

        return room


    async def get_room_history(self, user_id: str) -> List[Room]:
        """
        Given the user id, returns a history of rooms up to a certain date.
        """
        return self.crud_service.get_room_history(user_id)


        
