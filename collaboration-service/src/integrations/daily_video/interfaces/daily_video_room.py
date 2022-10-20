from typing import Dict
from pydantic import BaseModel

class DailyVideoRoom(BaseModel):
    """
    Pydantic wrapper aroudn a room for a daily video call. See
    https://docs.daily.co/reference/rest-api/rooms for the exact specifications.
    """

    id: str
    name: str
    api_created: bool
    privacy: str
    url: str
    created_at: str
    config: Dict[str, any]
