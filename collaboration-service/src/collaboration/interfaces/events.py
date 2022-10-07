from typing import List
from pydantic import BaseModel
from enum import IntEnum

class ChatRoomEventType(IntEnum):
    USER_JOIN = 0
    USER_LEFT = 1

class ChatRoomEvent(BaseModel):
    """
    The base event class for chat room events.
    """
    user_ids: List[str] # the user ids involved in the event
    message: str # the message tied to the event
    event_type: ChatRoomEventType

