from typing import List
from pydantic import BaseModel
from enum import IntEnum

class QuestionTopic(IntEnum):
    ARRAYS_AND_HASHING = 0

class QuestionDifficulty(IntEnum):
    EASY = 0
    MEDIUM = 1
    HARD = 2

class Question(BaseModel):

    qid: str
    title: str # question
    description: str
    difficulty: QuestionDifficulty
    topic: QuestionTopic


