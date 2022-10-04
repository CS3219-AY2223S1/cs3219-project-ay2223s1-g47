from typing import List

from src.constants import QUESTION_SERVICE_HOST

from src.collaboration.services.room_crud_services import RoomCrudService
from src.api.question_service_api import QuestionServiceApiHandler
from src.db.db import db
from src.collaboration.interfaces.room import RoomInResponse
from fastapi import APIRouter
from src.collaboration.crud_manager import CrudManager

router = APIRouter()

router.post("/create", dependencies=[]) # TODO: add auth in dependencies
def create_room(user1_id: str, user2_id: str, difficulty: int) -> RoomInResponse:
    # 1. create manager and ask it to create room
    manager = CrudManager(RoomCrudService(db), QuestionServiceApiHandler(api_base_url=QUESTION_SERVICE_HOST))
    room = manager.create_room(user1_id, user2_id, difficulty)

    # 2. convert to exposable interface
    return RoomInResponse.from_room(room)


router.get("/get_room_history", dependencies=[]) # TODO: add auth in dependencies
def get_room_history(user_id: str) -> List[RoomInResponse]:
    # 1. create manager and ask it to get room history
    manager = CrudManager()
    room_history = manager.get_room_history(user_id)

    # 2. convert to exposable interface
    return [RoomInResponse.from_room(room) for room in room_history]

    