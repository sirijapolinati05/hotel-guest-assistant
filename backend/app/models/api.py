from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date

class ChatMessage(BaseModel):
    role: str
    text: str

class AvailabilityContext(BaseModel):
    active: bool = False
    check_in: Optional[str] = None
    check_out: Optional[str] = None
    adults: Optional[int] = None
    room_type: Optional[str] = None
    preferred_check_in_time: Optional[str] = None
    preferred_check_out_time: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    conversation: List[ChatMessage]
    availability_context: Optional[AvailabilityContext] = None

class AvailabilityRequest(BaseModel):
    check_in: date
    check_out: date
    adults: int = Field(ge=1)

class RoomAvailability(BaseModel):
    id: str
    name: str
    price_per_night: int
    beds: str
    max_guests: int
    available_count: int

class ChatResponse(BaseModel):
    reply: str
    intent: str
    availability: Optional[List[RoomAvailability]] = None
    availability_context: Optional[AvailabilityContext] = None

