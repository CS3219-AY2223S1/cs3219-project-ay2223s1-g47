from typing import List

from src.integrations.daily_video.services.daily_video_services import DailyVideoService

from src.api.user_service_api import UserServiceApiHandler
from src.collaboration.services.room_crud_services import RoomCrudService
from src.api.question_service_api import QuestionServiceApiHandler
from src.collaboration.interfaces.room import Room


class CrudManager:
    """
    Responsible for crud operations on the rooms table 
    in the collaboration service database.
    """

    def __init__(self, 
        crud_service: RoomCrudService, 
        question_service: QuestionServiceApiHandler,
        user_service: UserServiceApiHandler,
        video_service: DailyVideoService
    ):
        self.crud_service = crud_service
        self.question_service = question_service
        self.user_service = user_service
        self.video_service = video_service

    async def create_room(self, user1_id: str, user2_id: str, difficulty: int) -> Room:
        """
        Creates a new room in db and sets a worker to close the room after some predefined time.
        """
        # 1. asynchronously ask for a question for question service
        question = await self.question_service.get_question(difficulty)

        # 2. asynchronously ask for the usernames of the specified users
        username1 = await self.user_service.get_username(user1_id)
        username2 = await self.user_service.get_username(user2_id)

        # 3. asynchronously create the video call room
        video_room_name = self.video_service.generate_unique_name()
        video_room = await self.video_service.create_video_room(video_room_name)

        # 4. yield
        # TODO: figure out async

        # 5. create object
        room = self.crud_service.create_room(user1_id, username1, user2_id, username2, video_room, question)

        return room
    
    def get_room(self, room_id: str) -> Room:
        """
        Given the room id, returns the room object.
        """
        return self.crud_service.get_room_by_id(room_id)


    def get_room_history(self, user_id: str) -> List[Room]:
        """
        Given the user id, returns a history of rooms up to a certain date.
        """
        return self.crud_service.get_room_history(user_id)


        
