from dotenv import load_dotenv
import os
load_dotenv() # load environment variables from .env file
from pathlib import Path

# assertions to check .env file
assert os.environ.get("ENV") in ['DEV', 'PROF']
assert os.environ.get("MONGODB_CLOUD_URI") or os.environ.get("MONGODB_LOCAL_URI")
assert os.environ.get("PORT") is not None
assert os.environ.get("HOST") is not None
assert os.environ.get("QUESTION_SERVICE_HOST") is not None

# enviroment
ENV_IS_PROD = os.environ.get("ENV") == 'PROD'
ENV_IS_DEV = os.environ.get("ENV") == 'DEV'

# port
PORT= int(os.environ.get("PORT"))
HOST= os.environ.get("HOST")

# mongodb
MONGODB_CLOUD_URI = os.environ.get("MONGODB_CLOUD_URI")
MONGODB_LOCAL_URI = os.environ.get("MONGODB_LOCAL_URI")
MONGODB_URI = MONGODB_CLOUD_URI if ENV_IS_PROD else MONGODB_LOCAL_URI
MONGODB_COLLABORATION_DATABASE_NAME = "collaboration-service"

# mongodb tables
MONGODB_JSON_PATH = str(Path("/home/tannaaman/NUS/CS3219/cs3219-project-ay2223s1-g47/collaboration-service/src/dev-data.json").resolve())
ROOM_TABLE_NAME = "rooms"
MONGODB_TABLES = [
    ROOM_TABLE_NAME
]

# room service
CLEANUP_TIMEOUT_IN_SECONDS = 300 # 5 minutes

# question service
QUESTION_SERVICE_HOST = os.environ.get("QUESTION_SERVICE_HOST")
QUESTION_SERVICE_GET_QUESTION_ENDPOINT = "/question"