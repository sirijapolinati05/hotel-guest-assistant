import os
import sys
sys.path.append(os.getcwd())

# Load env file to get API key if needed, or rely on .env if python-dotenv is used
from dotenv import load_dotenv
load_dotenv()

from app.services.gemini_service import process_chat
from app.models.api import ChatMessage

msg = ChatMessage(role="user", text="Hi, I want a room.")
res = process_chat("Hi, I want a room.", [msg])
print("RESULT:", res)
