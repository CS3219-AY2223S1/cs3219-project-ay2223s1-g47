from src.db.db import DatabaseWrapper
from pydantic import BaseModel
from typing import List

class DatabaseIndexWrapper(BaseModel):
    """
    Specifies the fields needed to add an index to a collection our db.
    """

    collection_name: str
    index_name: str # name of index
    index_fields: List[str] # list of fields to index (string_name, pymongo.DESCENDING/ASCENDING)
    sparse: bool # if true, any document lacking the index field is omitted

    