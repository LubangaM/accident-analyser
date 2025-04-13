from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import accidents, analytics, auth
from api import upload
from init_db import init_db
from config import get_settings

settings = get_settings()

app = FastAPI(title="Accident Analysis API")

# Initialize database
init_db()


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(
    accidents.router,
    prefix="/api/v1",
    tags=["accidents"],
)

app.include_router(
    upload.router,
    prefix="/api/v1",
    tags=["upload"],
)
app.include_router(
    analytics.router,
    prefix="/api/v1",
    tags=[
        "analytics",
    ],
)

app.include_router(
    auth.router,
    prefix="/api/v1",
    tags=[
        "auth",
    ],
)


@app.get("/")
async def root():
    return {"message": "Welcome to the Accident Analysis API"}
