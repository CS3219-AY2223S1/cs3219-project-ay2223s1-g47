from typing import List
from pydantic import BaseModel

class Question(BaseModel):

    question_id: str # question id
    question: str # question
    question_resource_uris: List[str]  # question resource uri e.g. image
    answer: str # answer
    answer_resource_uris: List[str] # answer resource uri e.g. image
    created_at: str
    difficulty: int
