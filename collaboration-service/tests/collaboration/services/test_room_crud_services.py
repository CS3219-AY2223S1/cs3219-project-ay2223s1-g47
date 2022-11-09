from typing import List
from uuid import uuid4

from src.collaboration.models.room import RoomModel
from src.collaboration.interfaces.room import Room
from src.collaboration.services.room_crud_services import RoomCrudService
from src.db.db import DatabaseWrapper
from src.constants import  ROOM_TABLE_NAME

from tests.object_factories import create_question, create_room, create_video_room
import mongomock
import pytest

class TestRoomCrudService:

    def test_create_and_get_room(self):
        """
        Test that a room can be created and retrieved successfully
        """
        # given 
        test_db = DatabaseWrapper(_client=mongomock.MongoClient())
        service = RoomCrudService(test_db)
        room_id = str(uuid4())
        user1_id = str(uuid4())
        username1 = "user1"
        user2_id = str(uuid4())
        username2 = "user2"
        question = create_question()
        video_room = create_video_room()

        # when 
        service.create_room(user1_id=user1_id, 
            username1=username1, 
            user2_id=user2_id, 
            username2=username2, 
            video_room=video_room, 
            question=question, 
            _room_id=room_id
        )
        room = service.get_room_by_id(room_id)

        # then
        assert room.room_id == room_id
        assert room.user1_id == user1_id
        assert room.username1 == username1
        assert room.user2_id == user2_id
        assert room.username2 == username2
        assert room.question == question        
        assert room.video_room == video_room


    @pytest.mark.parametrize(
        "rooms_in_db, updated_rooms",
        [
            pytest.param(
                [create_room(room_id="1"), create_room(room_id="2"), create_room(room_id="3")],
                [create_room(room_id="1"), create_room(room_id="2"), create_room(room_id="3")],
                id="update rooms"
            ),
        ]
    )
    def test_update_room(self, rooms_in_db: List[Room], updated_rooms: List[Room]):
        """
        Test that a room can be updated successfully
        """
        # given
        test_db = DatabaseWrapper(_client=mongomock.MongoClient())
        service = RoomCrudService(test_db)
        for room in rooms_in_db:
            service.create_room(room.user1_id, room.username1, room.user2_id, room.username2, room.video_room, room.question, room.room_id)
        
        # when
        for room in updated_rooms:
            service.update_room(room)
        
        # then
        for room in updated_rooms:
            assert service.get_room_by_id(room.room_id) == room

    @pytest.mark.parametrize(
        "user_id, rooms_in_db_without_expected, expected_rooms",
        [
            pytest.param(
                "user1", [
                    create_room(user1_id="user3", user2_id="user2"),
                    create_room(user1_id="user4", user2_id="user3"),
                    create_room(user1_id="user2", user2_id="user3"),
                ], 
                [],
                id="no matching rooms in db"
            ),
            pytest.param(
                "user1", [], [], id= "no rooms in db"
            ),
            pytest.param(
                "user1", [   
                    create_room(user1_id="user4", user2_id="user2"),
                ], [
                    create_room(user1_id="user1", user2_id="user2"),
                    create_room(user1_id="user1", user2_id="user3"),
                    create_room(user1_id="user2", user2_id="user1"),
                ], id= "user in some rooms as user 1, others as user 2"
            )
        ]
    )
    def test_get_room_history(self, user_id: str, rooms_in_db_without_expected: List[RoomModel], expected_rooms: List[Room]):
        """
        Test that a room history can be retrieved successfully. 
        NOTE: rooms_in_db_without_expected is a list of rooms that are in the db but not expected to be returned.
            so the total rooms are expected_rooms + rooms_in_db_without_expected
        """
        # ======= given ======= 
        # mock db
        test_db = DatabaseWrapper(_client=mongomock.MongoClient()) 
        service = RoomCrudService(test_db)
        for room in (rooms_in_db_without_expected + expected_rooms):
            test_db.insert(ROOM_TABLE_NAME, room.dict())
        
        # ======= when =======
        rooms = service.get_room_history(user_id)


        # ======= then =======
        # sort the rooms by room_id
        rooms.sort(key=lambda room: room.room_id)
        expected_rooms.sort(key=lambda room: room.room_id)
        assert rooms == expected_rooms, f"Expected {len(expected_rooms)} rooms but got {len(rooms)} rooms"

        



    

    
        