from pydantic import BaseModel
from src.collaboration.interfaces.user import User

class ChatMessage(BaseModel):

    message: str
    user: User
    timestamp: str