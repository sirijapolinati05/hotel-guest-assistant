import sys
import os
from pathlib import Path

# Add backend directory to sys.path so 'app' imports work
backend_dir = Path(__file__).parent.parent / "backend"
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

# Import the FastAPI app instance from backend
from app.main import app
