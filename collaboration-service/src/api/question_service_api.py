from src.constants import QUESTION_SERVICE_GET_QUESTION_ENDPOINT
from src.collaboration.interfaces.question import Question
import requests

class QuestionServiceApiHandler:

    def __init__(self, api_base_url: str):
        self.api_base_url = api_base_url

    async def _get(self, endpoint: str, params: dict = None):
        """
        Handles get API call to question service
        """
        url = self.api_base_url + endpoint
        response = requests.get(url, params=params)
        return response.json()

    async def get_question(self, difficulty: int) -> Question:
        """
        Gets a question from the question service.
        """
        response = await self._get(endpoint=QUESTION_SERVICE_GET_QUESTION_ENDPOINT, params={"difficulty": difficulty})
        return Question(**response)
    

    
        