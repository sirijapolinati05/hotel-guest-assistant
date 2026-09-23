# Simplotel Grand Hotel AI Assistant

A full-stack AI-powered hotel guest assistant for Simplotel Grand Hotel.

## Problem
Guests frequently ask the same questions (check-in times, amenities, policies) and check room availability. A human-in-the-loop is often required, which scales poorly. This project solves that by providing an intelligent, always-available assistant that can handle FAQs naturally and deterministically check room availability.

## Guest Journey
1. The guest opens the assistant and is greeted.
2. The guest can click on suggested FAQs or type a natural language question.
3. If the question is about policies or amenities, the AI responds conversationally using its strict system prompt.
4. If the guest asks for availability, the AI identifies the intent and prompts the UI to display a date selection form.
5. Upon submitting dates and guest counts, the backend queries the database deterministically (without AI hallucination) and returns the available rooms.

## Architecture & Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS (deployed to Vercel)
- **Backend**: Python, FastAPI, Pydantic (deployed to Render)
- **Database**: Supabase PostgreSQL (Stores hotels, rooms, policies, amenities, and room_inventory)
- **AI**: Gemini API via `google-genai` SDK on the backend.

## AI Architecture & Hallucination Prevention
The AI logic runs entirely on the backend to keep API keys secure. 
To prevent hallucination:
1. **Strict System Prompt**: The hotel's data (policies, amenities, rooms, pricing) is hardcoded into the System Prompt. The model is explicitly instructed to *never* invent facts or prices.
2. **Deterministic Availability**: The LLM is *never* used to decide if a room is available. It is only used to classify intent. When the user asks for availability, the LLM outputs `{"intent": "availability_request"}`. The frontend then displays a deterministic form that queries the database directly.

## API Examples

### Chat
`POST /api/chat`
```json
{
  "message": "Do you have a pool?",
  "conversation": []
}
```
Response:
```json
{
  "intent": "faq",
  "reply": "Yes, we have a swimming pool among our amenities!"
}
```

### Availability
`POST /api/availability`
```json
{
  "check_in": "2026-10-05",
  "check_out": "2026-10-08",
  "adults": 3
}
```
Response:
```json
[
  {
    "id": "22222222-2222-2222-2222-222222222222",
    "name": "Executive Room",
    "price_per_night": 7000,
    "beds": "King Bed + Sofa Bed",
    "max_guests": 3,
    "available_count": 2
  }
]
```

## Local Setup

1. **Database**: 
   - Execute `db/schema.sql` in your Supabase SQL editor.
2. **Backend**:
   - `cd backend`
   - Create a `.env` file with `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`.
   - `python -m venv venv`
   - `.\venv\Scripts\activate`
   - `pip install -r requirements.txt`
   - `uvicorn app.main:app --reload`
3. **Frontend**:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

## Testing
10 automated test scenarios are available in `backend/tests/test_api.py`.
Run them using:
```bash
cd backend
pytest tests/
```

## Product & UX Decisions
- **Premium Aesthetic**: Used warm neutral backgrounds, white cards, dark charcoal typography, and subtle gold/beige accents.
- **Micro-interactions**: Subtle bounce animations on loading indicators, smooth scrolling, and hover effects on buttons.
- **Fail-safes**: Clear error banners if the AI or DB fails.

## Future Improvements
- **Booking Integration**: Add a deterministic "Book Now" flow that interacts with a payment gateway.
- **Contextual RAG**: For very large hotels, instead of hardcoding policies in the prompt, use a fast local embeddings lookup (though not strictly necessary here).
- **Authentication**: Guest login to view existing bookings.
