from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GEMINI_API_KEY: str = "dummy_key"
    GEMINI_MODEL: str = "gemini-3.6-flash"
    SUPABASE_URL: str = "http://dummy_url"
    SUPABASE_KEY: str = "dummy_key"

    class Config:
        env_file = ".env"

settings = Settings()
settings.GEMINI_API_KEY = settings.GEMINI_API_KEY.strip()
settings.GEMINI_MODEL = settings.GEMINI_MODEL.strip()
settings.SUPABASE_URL = settings.SUPABASE_URL.strip()
settings.SUPABASE_KEY = settings.SUPABASE_KEY.strip()
