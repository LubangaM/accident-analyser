from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import accidents, analytics, auth
from init_db import init_db
from config import get_settings

settings = get_settings()

app = FastAPI(title="Accident Analyser API")

# Initialize database
init_db()


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

app.include_router(
    auth.router,
    prefix="/api/v1/auth",
    tags=[
        "auth",
    ],
)


@app.get("/")
async def root():
    return {"message": "Welcome to Accident Analyser API"}
