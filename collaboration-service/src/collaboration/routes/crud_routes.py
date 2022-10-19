from typing import List

from src.api.user_service_api import UserServiceApiHandler
from src.collaboration.exceptions import AuthorizationException
from src.collaboration.interfaces.user import User
from src.collaboration.routes.route_dependencies import jwt_auth_from_cookie
from src.collaboration.services.room_crud_services import RoomCrudService
from src.api.question_service_api import QuestionServiceApiHandler
from src.db.db import db
from src.collaboration.interfaces.room import RoomInResponse
from fastapi import APIRouter, Depends, Body
from src.collaboration.crud_manager import CrudManager

router = APIRouter()

@router.post("/create", dependencies=[]) # TODO: add auth in dependencies
async def create_room(user1_id: str = Body(), user2_id: str= Body(), difficulty: int= Body()) -> RoomInResponse:
    # 1. create manager and ask it to create room
    manager = CrudManager(RoomCrudService(db), QuestionServiceApiHandler(), UserServiceApiHandler())
    room = await manager.create_room(user1_id, user2_id, difficulty)

    # 2. just return id for now
    return room.room_id


@router.get("/get_room_history", dependencies=[]) # TODO: add auth in dependencies
def get_room_history(user_id: str) -> List[RoomInResponse]:
    # 1. create manager and ask it to get room history
    manager = CrudManager(RoomCrudService(db), QuestionServiceApiHandler(), UserServiceApiHandler())
    room_history = manager.get_room_history(user_id)

    # 2. convert to exposable interface
    return [RoomInResponse.from_room(room) for room in room_history]


@router.get("/get_room/{room_id}") # TODO: add auth in dependencies  
def get_room(room_id: str, user: User=Depends(jwt_auth_from_cookie)) -> RoomInResponse:
    # 1. create manager and ask it to get room
    manager = manager = CrudManager(RoomCrudService(db), QuestionServiceApiHandler(), UserServiceApiHandler())
    room = manager.get_room(room_id)
    if user.id not in [room.user2_id, room.user1_id]:
        raise AuthorizationException("User not in room")
    
    # 2. convert to exposable interface
    return RoomInResponse.from_room(room)