

from src.constants import DAILY_VIDEO_TOKEN
from src.integrations.daily_video.services.daily_video_services import DailyVideoService

import aiohttp
import pytest
import requests

class TestDailyVideoServices:
    def test_ping(self):
        """
        Tests that the service is up and running.
        """
        response=requests.get("https://api.daily.co/v1/", headers={
            "Authorization":"Bearer " + DAILY_VIDEO_TOKEN,
            "Content-Type": "application/json"
        })
        print(response.json())


    @pytest.mark.asyncio
    async def test_create_get_delete_room(self):
        """
        Tests that creating rooms is possible, and then immediately deletes it
        """
        async with aiohttp.ClientSession() as session:
             # given
            service= DailyVideoService(_session=session)
            unique_room_name = service.generate_unique_name()
            try: 
            
                # when
                room = await service.create_video_room(unique_room_name)
                gotten_room = await service.get_video_room_by_id(unique_room_name)

                # then
                assert room.name == unique_room_name
                assert gotten_room.name == unique_room_name

            finally:
                # after
                await service.delete_video_room(room.name)




        




    