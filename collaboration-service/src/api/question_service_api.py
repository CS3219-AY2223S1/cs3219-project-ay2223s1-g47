import requests

class QuestionServiceApiHandler:

    def __init__(self, api_base_url: str):
        self.api_base_url = api_base_url

    def get(self, endpoint: str, params: dict = None):
        url = self.api_base_url + endpoint
        response = requests.get(url, params=params)
        return response.json()

    

    
        