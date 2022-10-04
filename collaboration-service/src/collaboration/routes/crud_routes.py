from typing import List
from src.collaboration.interfaces.room import RoomInResponse
from fastapi import APIRouter
from src.collaboration.crud_manager import CrudManager

router = APIRouter()

router.post("/create", dependencies=[]) # TODO: add auth in dependencies
async def create_room(user1_id: str, user2_id: str, difficulty: int) -> RoomInResponse:
    # 1. create manager and ask it to create room
    manager = CrudManager()
    room = await manager.create_room(user1_id, user2_id, difficulty)

    # 2. convert to exposable interface


router.get("/get_room_history", dependencies=[]) # TODO: add auth in dependencies
async def get_room_history(user_id: str) -> List[RoomInResponse]:
    # 1. create manager and ask it to get room history
    manager = CrudManager()
    room_history = await manager.get_room_history(user_id)

    # 2. convert to exposable interface

    