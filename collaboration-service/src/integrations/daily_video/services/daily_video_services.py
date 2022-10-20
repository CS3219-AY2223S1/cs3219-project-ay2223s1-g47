from src.exceptions import VideoServiceException
from src.integrations.daily_video.interfaces.daily_video_room import DailyVideoRoom

import aiohttp

class DailyVideoServices:
    """
    Service class that wraps around the daily video API. 
    """

    def __init__(self, daily_server_host: str):
        self.daily_server_host = daily_server_host

    async def create_video_room(self, unique_room_name: str, privacy: str = "public") -> DailyVideoRoom:
        """
        Creates a video room on the daily video server.
        See https://docs.daily.co/reference/rest-api/rooms/create-room for more details.
        
        """
        with aiohttp.ClientSession() as session:
            session: aiohttp.ClientSession
            async with session.post(self.daily_server_host + "/rooms", data=dict(name=unique_room_name, privacy=privacy)) as response:
                response: aiohttp.ClientResponse
                response_json = await response.json()
                if response.status != 200:
                    raise VideoServiceException("Error creating video room!", detail=response_json)
                return DailyVideoRoom(**response_json)

    async def get_video_room_by_id(self, unique_room_name: str) -> DailyVideoRoom:
        """
        Gets a video room by its id.
        See https://docs.daily.co/reference/rest-api/rooms/get-room-config for more details.
        """
        with aiohttp.ClientSession() as session:
            session: aiohttp.ClientSession
            async with session.get(self.daily_server_host + "/rooms:" + unique_room_name) as response:
                response: aiohttp.ClientResponse
                response_json = await response.json()
                if response.status != 200:
                    raise VideoServiceException("Error creating video room!", detail=response_json)
                return DailyVideoRoom(**response_json)        

    





        
    