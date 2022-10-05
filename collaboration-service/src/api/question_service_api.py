from src.api.api_handler import ApiHandler
from src.constants import QUESTION_SERVICE_GET_QUESTION_ENDPOINT
from src.collaboration.interfaces.question import Question
from tests.object_factories import create_question

class QuestionServiceApiHandler:

    def __init__(self, _api_handler: ApiHandler):
        self.handler = _api_handler or ApiHandler(QUESTION_SERVICE_BASE_URL)


    async def get_question(self, difficulty: int) -> Question:
        """
        Gets a question from the question service.
        """
        # TODO: unmock this when question service is implemented
        # response = await self._get(endpoint=QUESTION_SERVICE_GET_QUESTION_ROUTE, params={"difficulty": difficulty})
        response = create_question().dict()
        return Question(**response)
    

    
    

    
        