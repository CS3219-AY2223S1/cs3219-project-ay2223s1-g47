from src.api.api_handler import ApiHandler
from src.constants import QUESTION_SERVICE_HOST, QUESTION_SERVICE_GET_QUESTION_ENDPOINT
from src.collaboration.interfaces.question import Question

class QuestionServiceApiHandler:

    def __init__(self, _api_handler: ApiHandler = None):
        self.handler = _api_handler or ApiHandler(QUESTION_SERVICE_HOST)


    async def get_question(self, difficulty: int) -> Question:
        """
        Gets a question from the question service.
        """
        # TODO: unmock this when question service is implemented
        response = await self.handler._post(endpoint=QUESTION_SERVICE_GET_QUESTION_ENDPOINT, data={"difficulty": difficulty})
        # response = {
        #     "question_id": "1", # question id
        #     "question": "some question", # question
        #     "question_resource_uris": [],  # question resource uri e.g. image
        #     "answer": "some answer", # answer
        #     "answer_resource_uris": [], # answer resource uri e.g. image
        #     "created_at": "2021-01-01T00:00:00.000Z",
        #     "difficulty": 1
        # }
        return Question(**response)
    

    
    

    
        