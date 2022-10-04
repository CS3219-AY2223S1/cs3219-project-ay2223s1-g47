from typing import List
from src.collaboration.interfaces.chat_message import ChatMessage
from pydantic import BaseModel

class RoomState(BaseModel):

    chat_history: List[ChatMessage]
    code: str