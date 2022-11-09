from typing import List
from pydantic import BaseModel
from enum import IntEnum

class QuestionTopic(IntEnum):
    ARRAY = 0
    STRING = 1
    SORTING = 2
    TREE = 3
    HASH_TABLE = 4
    DYNAMIC_PROGRAMMING = 5

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


