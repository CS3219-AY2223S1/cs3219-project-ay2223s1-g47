from typing import List
from pydantic import BaseModel
from enum import Enum

class ChatRoomEventType(Enum):
    USER_JOIN = "USER_JOIN"
    USER_LEFT = "USER_LEFT"

class ChatRoomEvent(BaseModel):
    """
    The base event class for chat room events.
    """
    user_ids: List[str] # the user ids involved in the event
    message: str # the message tied to the event
    event_type: ChatRoomEventType

