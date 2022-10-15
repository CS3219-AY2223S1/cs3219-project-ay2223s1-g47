import logging
# logging.basicConfig(level = logging.DEBUG)


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.collaboration.routes.crud_routes import router as crud_router
from src.collaboration.routes.collaboration_routes import router as collaboration_router
from src.constants import HOST, PORT
from fastapi_socketio import SocketManager

import uvicorn

# app
UVICORN_PORT = 8003

app = FastAPI()

# cors middleware
app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # can alter with time
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# add routers
app.include_router(
    crud_router,
    prefix="/crud",
)

app.include_router(
    collaboration_router,
)

# add support for socketio
socket_manager = SocketManager(app) # , cors_allowed_origins="*", cors_credentials=True)

# sanity
@app.get("/")
def root():
    return {"message": "Hello World from collaboration service"}

if __name__ == "__main__":

    # start app
    uvicorn.run("src.main:app", host=HOST, port=PORT, reload=True)
    logging.info("Collaboration service started.")

    # update db
    from src.db.db import db