from src.collaboration.exceptions import DatabaseException, DatabaseItemNotFoundException
from src.db.interfaces import DatabaseIndexWrapper
from pymongo import MongoClient
from src.constants import ENV_IS_DEV, MONGODB_COLLABORATION_DATABASE_NAME, MONGODB_JSON_PATH, MONGODB_TABLES, MONGODB_URI
from typing import Any, Dict, List, Mapping
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

    def insert(self, table: str, data: object):
        """
        Inserts data into a table.
        """
        self.db[table].insert_one(data)

    def get_items(self, table:str, index_keys: List[Dict[str, str]]) -> List[Mapping[str, Any]]:
        """
        Gets an item from a table.
        """
        return self.db[table].find(index_keys)

    def update_item(self, table: str, index_keys: List[Dict[str, str]], data: Mapping[str, Any]):
        """
        Updates an item in a table.
        
        """
        find = self.db[table].find(index_keys)
        if len(find) == 0:
            raise DatabaseItemNotFoundException(f"Could not find item in table {table} with index keys {index_keys}")
        elif len(find) > 1:
            raise DatabaseException(f"Found multiple items in table {table} with index keys {index_keys}, but trying to update one.")

        result = self.db[table].update_one(index_keys, data)
        if result.modified_count == 0:
            raise DatabaseException("Could not update item in table")
        

db = DatabaseWrapper()
if ENV_IS_DEV:
    # read data from json
    logging.debug("Reading dev data from json...")
    import json
    with open(MONGODB_JSON_PATH, "r") as f:
        table_to_items_map = json.load(f)
        db.populate_database(table_to_items_map)

    