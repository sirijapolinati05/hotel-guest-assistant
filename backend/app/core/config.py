from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GEMINI_API_KEY: str = "dummy_key"
    GEMINI_MODEL: str = "gemini-3.6-flash"
    SUPABASE_URL: str = "http://dummy_url"
    SUPABASE_KEY: str = "dummy_key"

    class Config:
        env_file = ".env"

settings = Settings()
