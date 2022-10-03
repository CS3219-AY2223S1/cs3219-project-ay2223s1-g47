from src.db.interfaces import DatabaseIndexWrapper
from pydantic import BaseModel
from pymongo import MongoClient
from src.constants import MONGODB_COLLABORATION_COLLECTION_NAME, MONGODB_COLLABORATION_DATABASE_NAME, MONGODB_TABLES, MONGODB_URI
from typing import Dict, List
import logging


class DatabaseWrapper:

    def __init__(self, _moongodb_uri: str = None, _collection_name: str = None):
        # initialize db and collection being referenced
        self.db = MongoClient(MONGODB_URI if _moongodb_uri is None else _moongodb_uri)[MONGODB_COLLABORATION_DATABASE_NAME]

    def populate_database(self, table_to_items_map: Dict[str, List[object]]): 
        """
        POpulates the db with the given data.
        """
        logging.info("Populating database from data...")
        for table in MONGODB_TABLES:

            # 1. drop table
            self.db.drop_collection(table)

            # 2. insert data
            items = table_to_items_map[table]
            logging.info(f"Populating table {table}")
            self.db[table].insert_many(items)

        logging.info("Done populating database from data.")
    
    def create_index(self, index_specifications: DatabaseIndexWrapper): 
        """
        Creates an index for a certain access pattern specified. 
        For more details, see https://pymongo.readthedocs.io/en/stable/api/pymongo/collection.html#pymongo.collection.Collection.create_index
        """
        
        self.db[index_specifications.collection_name].create_index(
            index_specifications.index_fields,
            name=index_specifications.index_name,
            sparse=index_specifications.sparse
        )

db = DatabaseWrapper()