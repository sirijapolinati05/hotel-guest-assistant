from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.api.endpoints import router as api_router

app = FastAPI(title="Simplotel Grand Hotel AI Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

class HealthResponse(BaseModel):
    status: str

@app.get("/health", response_model=HealthResponse)
def health_check():
    return {"status": "ok"}

@app.get("/health/ai")
def ai_health_check():
    from app.core.config import settings
    configured = bool(settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "dummy_key")
    return {"status": "ok" if configured else "error", "configured": configured, "model": settings.GEMINI_MODEL}
