import requests

class ApiHandler:


    def __init__(self, api_base_url: str):
        self.api_base_url = api_base_url
        

    async def _get(self, endpoint: str, params: dict = None) -> dict:
        """
        Handles get API call 
        """
        url = self.api_base_url + endpoint
        response = requests.get(url, params=params)
        return response.json()

    async def _post(self, endpoint: str, data: dict = None) -> dict:
        """
        Handles post API call
        """
        url = self.api_base_url + endpoint
        response = requests.post(url, data=data)
        return response.json()