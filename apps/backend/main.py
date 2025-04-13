from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import accidents, analytics

from functools import lru_cache
from config import Settings

app = FastAPI(title="Accident Analyser API")


@lru_cache
def get_settings():
    return Settings()


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
    ],  # React vite frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(
    accidents.router,
    prefix="/api/v1",
    tags=[
        "accidents",
    ],
)
app.include_router(
    analytics.router,
    prefix="/api/v1/analytics",
    tags=[
        "analytics",
    ],
)


@app.get("/")
async def root():
    return {"message": "Welcome to Accident Analyser API"}
