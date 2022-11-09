from typing import List
from src.collaboration.interfaces.chat_message import ChatMessage
from pydantic import BaseModel

class RoomState(BaseModel):

    code: str

    @staticmethod
    def from_frontend_state(frontend_state: dict):
        """
        Updates the room state from a frontend state.
        """
        return RoomState(
            code = frontend_state["code"]
        )
