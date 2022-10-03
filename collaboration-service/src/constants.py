from dotenv import load_dotenv
import os
load_dotenv() # load environment variables from .env file

# assertions to check .env file
assert os.environ.get("ENV") in ['DEV', 'PROF']
assert os.environ.get("MONGODB_CLOUD_URI") or os.environ.get("MONGODB_LOCAL_URI")

# enviroment
ENV_IS_PROD = os.environ.get("ENV") == 'PROD'
ENV_IS_DEV = os.environ.get("ENV") == 'DEV'

# mongodb
MONGODB_CLOUD_URI = os.environ.get("MONGODB_CLOUD_URI")
MONGODB_LOCAL_URI = os.environ.get("MONGODB_LOCAL_URI")
MONGODB_URI = MONGODB_CLOUD_URI if ENV_IS_PROD else MONGODB_LOCAL_URI
MONGODB_COLLABORATION_DATABASE_NAME = "collaboration-service"

# mongodb tables
ROOM_TABLE_NAME = "rooms"
MONGODB_TABLES = [
    ROOM_TABLE_NAME
]