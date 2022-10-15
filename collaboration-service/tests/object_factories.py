from typing import List

from src.collaboration.interfaces.user import User
from src.collaboration.interfaces.chat_message import ChatMessage
from src.collaboration.interfaces.room_state import RoomState
from src.collaboration.interfaces.room import Room
from faker import Faker
from src.collaboration.interfaces.question import Question



def create_question(
    question_id:str = None,
    question: str = None,
    question_resource_uris: List[str] = None,
    answer: str = None,
    answer_resource_uris: List[str] = None,
    created_at: str = None,
    difficulty: int = None
) -> Question:
    """
    Factory method for a question object.
    """
    fake = Faker()
    return Question(
        question_id=question_id or  fake.uuid4(),
        question=question or fake.sentence(),
        question_resource_uris=question_resource_uris or [fake.uri()],
        answer=answer or fake.sentence(),
        answer_resource_uris=answer_resource_uris or [fake.uri()],
        created_at=created_at or str(fake.date_time()),
        difficulty=difficulty or fake.random_int(min=1, max=3)
    )

def create_user(
    id: str = None,
    username: str = None,
    password: str = None
) -> User:
    """
    Factory method for a user object.
    """
    fake = Faker()
    return User(
        id=id or fake.uuid4(),
        username=username or fake.name(),
        password=password or fake.password()
    )

def create_room_state(
    code: str = None,
    chat_history: List[ChatMessage] = None
) -> RoomState:
    """
    Factory method for a room state object.
    """
    fake = Faker()
    return RoomState(
        code=code or fake.sentence(),
        chat_history=chat_history or [
            ChatMessage(
                timestamp=str(fake.date_time()),
                message=fake.sentence(),
                user=create_user()

            )
        ]
    )

def create_room(
    room_id: str = None,
    created_at: str = None,
    is_closed: bool = None,
    state: bool = None,
    num_in_room: int = None,
    user1_id: str = None,
    user2_id: str = None,
    question_id: str = None,
    question: Question = None,
    closed_at: str = None
) -> Room:
    """
    Factory method for a room object.
    """
    fake = Faker()
    return Room(
        room_id=room_id or fake.uuid4(),
        created_at=created_at or str(fake.date_time()),
        is_closed=is_closed or False,
        state=state or create_room_state(),
        num_in_room=num_in_room or 0,
        user1_id=user1_id or fake.uuid4(),
        user2_id=user2_id or fake.uuid4(),
        question_id=question_id or fake.uuid4(),
        question=question or create_question(),
        closed_at=closed_at or str(fake.date_time())
    )



