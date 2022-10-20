from typing import List

from src.collaboration.interfaces.events import ChatRoomEvent
from src.collaboration.interfaces.user import User
from src.collaboration.interfaces.room_state import RoomState
from src.collaboration.interfaces.room import Room
from faker import Faker
from src.collaboration.interfaces.question import Question, QuestionDifficulty, QuestionTopic



def create_question(
    qid:str = None,
    title: str = None,
    description: str = None,
    difficulty: QuestionDifficulty = None,
    topic: QuestionTopic = None
) -> Question:
    """
    Factory method for a question object.
    """
    fake = Faker()
    return Question(
        qid=qid or  fake.uuid4(),
        title = title or fake.sentence(),
        description = description or fake.sentence(),
        difficulty = difficulty or QuestionDifficulty.EASY,
        topic = topic or QuestionTopic.ARRAYS_AND_HASHING
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
) -> RoomState:
    """
    Factory method for a room state object.
    """
    fake = Faker()
    return RoomState(
        code=code or fake.sentence(),
    )

def create_room(
    room_id: str = None,
    created_at: str = None,
    state: bool = None,
    num_in_room: int = None,
    user1_id: str = None,
    user1_username: str = None,
    user2_id: str = None,
    user2_username: str = None,
    question_id: str = None,
    question: Question = None,
    events : List[ChatRoomEvent] = None
) -> Room:
    """
    Factory method for a room object.
    """
    fake = Faker()
    return Room(
        room_id=room_id or fake.uuid4(),
        created_at=created_at or str(fake.date_time()),
        state=state or create_room_state(),
        num_in_room=num_in_room or 0,
        user1_id=user1_id or fake.uuid4(),
        username1=user1_username or fake.name(),
        user2_id=user2_id or fake.uuid4(),
        username2=user2_username or fake.name(),
        question_id=question_id or fake.uuid4(),
        question=question or create_question(),
        events=events or []
    )



