from uuid import uuid4
from src.constants import DAILY_VIDEO_DOMAIN
from src.exceptions import VideoServiceException
from src.integrations.daily_video.interfaces.daily_video_room import DailyVideoRoom

import aiohttp
import json
class DailyVideoServices:
    """
    Service class that wraps around the daily video API. 
    """

    def __init__(self, session: aiohttp.ClientSession, _daily_server_host: str = DAILY_VIDEO_DOMAIN):
        self.daily_server_host = _daily_server_host
        self.session = session
        self.headers ={
            "Authorization":"Bearer " + "a4648e74d5bc82c51a31925d61ec9a015c7b6c83ce56140754622bf9d285d79d",
            "Content-Type": "application/json"
        }


    async def create_video_room(self, unique_room_name: str = None, privacy: str = "public") -> DailyVideoRoom:
        """
        Creates a video room on the daily video server.
        See https://docs.daily.co/reference/rest-api/rooms/create-room for more details.
        
        """
        # generate unique name if needed
        if unique_room_name is None:
            unique_room_name = self.generate_unique_name()
        data = json.dumps({"name":unique_room_name, "privacy":privacy} )
        
        # api call
        async with self.session.post(self.daily_server_host + "/rooms", data=data, headers=self.headers) as response:
            response: aiohttp.ClientResponse
            response_json = await response.json()
            if response.status != 200:
                raise VideoServiceException("Error creating video room!", detail=response_json)
            return DailyVideoRoom(**response_json)


    async def delete_video_room(self, unique_room_name: str):
        """
        Deletes a video room by its id.
        See https://docs.daily.co/reference/rest-api/rooms/delete-room for more details.
        """
        # api call
        async with self.session.delete(self.daily_server_host + "/rooms/" + unique_room_name, headers=self.headers) as response:
            response: aiohttp.ClientResponse
            response_json = dict(**await response.json())
            if response.status != 200:
                raise VideoServiceException("Error deleting video room!", detail=response_json)

    async def get_video_room_by_id(self, unique_room_name: str) -> DailyVideoRoom:
        """
        Gets a video room by its id.
        See https://docs.daily.co/reference/rest-api/rooms/get-room-config for more details.
        """
        async with self.session.get(self.daily_server_host + "/rooms/" + unique_room_name, headers=self.headers) as response:
            response: aiohttp.ClientResponse
            response_json = await response.json()
            if response.status != 200:
                raise VideoServiceException("Error creating video room!", detail=response_json)
            return DailyVideoRoom(**response_json) 

    def generate_unique_name(self) -> str:
        """
        Generates a unique name for a video room.
        """
        return str(uuid4()).split("-")[0]
        
         

    





        
    