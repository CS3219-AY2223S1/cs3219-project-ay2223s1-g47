from fastapi import FastAPI, WebSocket, WebSocketDisconnect, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from src.crud.routes.crud_routes import router as crud_router
    
# app
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

