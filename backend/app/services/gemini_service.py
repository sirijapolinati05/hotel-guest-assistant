import os
from google import genai
from google.genai import types
from app.core.config import settings
from app.models.api import ChatMessage
import json
import logging

logger = logging.getLogger(__name__)

# Lazy-initialize Gemini Client
_client = None

def _get_client():
    global _client
    if _client is None:
        if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "dummy_key":
            raise ValueError("GEMINI_API_KEY is not configured. Please set it in .env")
        _client = genai.Client(api_key=settings.GEMINI_API_KEY)
    return _client

HOTEL_CONTEXT = """
You are the AI Assistant for "Simplotel Grand Hotel".
Address: 123 MG Road, Bangalore, Karnataka, India.

POLICIES:
- Check-in time: 2:00 PM (Guests can request a different arrival time, subject to availability).
- Check-out time: 11:00 AM (Guests can request a different departure time, subject to availability).
- Cancellation: Free cancellation up to 24 hours before check-in.
- Pets: Pets are not allowed.
- Smoking: Smoking is not permitted inside guest rooms.
- Breakfast: Breakfast is served from 7:00 AM to 10:30 AM and is included with eligible bookings.
- Lunch: Lunch is served from 12:30 PM to 3:00 PM at our signature restaurant.
- Dinner: Dinner is served from 7:00 PM to 10:30 PM at our signature restaurant.

AMENITIES:
- Swimming Pool
- Gym
- Spa
- Free Wi-Fi
- Parking
- Restaurant

ROOMS:
- Deluxe Room: Max guests 2, King Bed, ₹5,000/night
- Executive Room: Max guests 3, King Bed + Sofa Bed, ₹7,000/night
- Family Suite: Max guests 4, King Bed + 2 Single Beds, ₹8,500/night

STRICT RULES:
1. NEVER invent hotel facts, prices, policies, or amenities not listed above.
2. NEVER invent room availability. Availability is checked by a separate system.
3. NEVER claim a booking was completed.
4. If the user asks about something unrelated to the hotel or unavailable information, provide a polite, safe fallback saying you don't have that information.
5. Use the conversation context provided to answer follow-up questions.

AVAILABILITY HANDLING:
When a user asks about room availability, you MUST:
1. Set intent to "availability".
2. Extract check_in, check_out, adults, and room_type from the user's message. Dates must be in ISO format YYYY-MM-DD.
3. If the user provides a date like "24-09-2026" or "September 24", convert it to "2026-09-24".
4. If only one date is given (e.g. "for September 24"), treat it as check_in. Set check_out to null and ask for the check-out date in your reply.
5. If check_in and check_out are provided but adults is missing, ask "How many adults will be staying?" in your reply.
6. If all required fields (check_in, check_out, adults) are present, say something like "Let me check that for you..." in your reply.
7. Look at the ENTIRE conversation history to find previously extracted dates/guests. If a user said "September 24" earlier and now says "September 26" for checkout, combine them.
8. NEVER redirect the user to a form or page. Handle everything inside the conversation.
9. PREFERRED TIMES: If the user provides a specific time (like "7 PM"), extract it to preferred_check_in_time or preferred_check_out_time. In your reply, explain briefly: "Our standard check-in is 2:00 PM and standard check-out is 11:00 AM. Your requested times can be treated as preferred arrival and departure times and are subject to availability." Then, if all required fields are present, check availability. If dates are missing, ask for the dates.
10. If an availability search is active and the user ONLY provides times (e.g. "7pm and 6am") instead of the missing dates, set contains_time to true and needs_clarification to true. Do not populate check_in or check_out with times.
11. CONVERSATIONAL STYLE: Whenever you provide a final answer to a question (like an FAQ), politely end your response with: "Is there anything else I can help you with? I would be very happy to answer." (Do not add this if you are actively waiting for the user to provide missing dates/adults).

OUTPUT FORMAT:
You must output a raw JSON object with the following structure (do not use markdown formatting like ```json):
{
  "intent": "faq" | "availability" | "availability_followup",
  "reply": "Your conversational response to the user",
  "check_in": "YYYY-MM-DD or null",
  "check_out": "YYYY-MM-DD or null",
  "adults": number or null,
  "room_type": "string or null",
  "preferred_check_in_time": "HH:MM or null",
  "preferred_check_out_time": "HH:MM or null",
  "contains_time": boolean or null,
  "needs_clarification": boolean or null
}

For non-availability questions, set intent to "faq" and leave check_in, check_out, adults, room_type as null.
"""

def process_chat(message: str, conversation: list[ChatMessage], availability_context: dict | None = None) -> dict:
    import time
    
    # Build dynamic system instruction with availability context
    system_prompt = HOTEL_CONTEXT
    
    if availability_context and availability_context.get("active"):
        ctx = availability_context
        context_note = "\n\nCURRENT AVAILABILITY SEARCH STATE:\n"
        context_note += f"An availability search is currently ACTIVE.\n"
        context_note += f"- check_in: {ctx.get('check_in') or 'NOT YET PROVIDED'}\n"
        context_note += f"- check_out: {ctx.get('check_out') or 'NOT YET PROVIDED'}\n"
        context_note += f"- adults: {ctx.get('adults') or 'NOT YET PROVIDED'}\n"
        context_note += f"- room_type: {ctx.get('room_type') or 'not specified'}\n"
        context_note += f"- preferred_check_in_time: {ctx.get('preferred_check_in_time') or 'not specified'}\n"
        context_note += f"- preferred_check_out_time: {ctx.get('preferred_check_out_time') or 'not specified'}\n"
        
        missing = []
        if not ctx.get('check_in'):
            missing.append('check_in date')
        if not ctx.get('check_out'):
            missing.append('check_out date')
        if not ctx.get('adults'):
            missing.append('number of adults')
        
        if missing:
            context_note += f"\nMISSING FIELDS: {', '.join(missing)}\n"
            context_note += "\nCRITICAL INSTRUCTIONS FOR THIS MESSAGE:\n"
            context_note += "1. The user's message is a FOLLOW-UP to the availability search above.\n"
            context_note += "2. Set intent to 'availability_followup'.\n"
            context_note += "3. Try to extract the missing fields from the user's current message. Remember that times like '7pm' are NOT dates.\n"
            context_note += "4. If the user's message provides times instead of dates, set contains_time and needs_clarification to true. Do NOT answer FAQ questions like check-in times if it is just a misunderstanding.\n"
            context_note += "5. If the user asks a genuine FAQ question (e.g., 'What time is check-in?'), set intent to 'faq', answer the question, but leave dates null.\n"
            context_note += "6. Do NOT overwrite fields that are already provided. Only fill in missing fields.\n"
            context_note += "7. Output ONLY the newly extracted values. Set already-known fields to null in your output (the backend will merge them).\n"
        else:
            context_note += "\nAll fields are present. Set intent to 'availability' and say 'Let me check that for you...'\n"
        
        system_prompt += context_note
    
    # Construct the conversation history for Gemini
    contents = []
    for msg in conversation:
        role = "user" if msg.role == "user" else "model"
        contents.append(
            types.Content(role=role, parts=[types.Part.from_text(text=msg.text)])
        )
    
    # Add the latest user message
    contents.append(
        types.Content(role="user", parts=[types.Part.from_text(text=message)])
    )
    
    # Retry logic for transient Gemini API errors
    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = _get_client().models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    temperature=0.0,
                    response_mime_type="application/json",
                    response_schema={
                        "type": "OBJECT",
                        "properties": {
                            "intent": {
                                "type": "STRING",
                                "enum": ["faq", "availability", "availability_followup"]
                            },
                            "reply": {
                                "type": "STRING"
                            },
                            "check_in": {
                                "type": "STRING",
                                "nullable": True
                            },
                            "check_out": {
                                "type": "STRING",
                                "nullable": True
                            },
                            "adults": {
                                "type": "INTEGER",
                                "nullable": True
                            },
                            "room_type": {
                                "type": "STRING",
                                "nullable": True
                            },
                            "contains_time": {
                                "type": "BOOLEAN",
                                "nullable": True
                            },
                            "needs_clarification": {
                                "type": "BOOLEAN",
                                "nullable": True
                            },
                            "preferred_check_in_time": {
                                "type": "STRING",
                                "nullable": True
                            },
                            "preferred_check_out_time": {
                                "type": "STRING",
                                "nullable": True
                            }
                        },
                        "required": ["intent", "reply"]
                    }
                )
            )
            
            result = json.loads(response.text)
            return result
        except json.JSONDecodeError:
            return {
                "intent": "faq",
                "reply": "I'm sorry, I am experiencing a technical issue right now. Please try again later."
            }
        except Exception as e:
            error_str = str(e).lower()
            logger.exception("Gemini API request failed")
            
            msg_lower = message.lower()
            is_availability = any(word in msg_lower for word in ["availability", "room", "book", "check in", "check-in", "check out", "check-out", "stay"])
            availability_suggestion = " You can still use the hotel availability search." if is_availability else ""
            
            if "401" in error_str or "403" in error_str or "api key" in error_str:
                return {
                    "intent": "faq",
                    "reply": f"I'm having trouble accessing the AI assistant right now due to authentication issues.{availability_suggestion}"
                }
                
            if "429" in error_str or "quota" in error_str or "resource exhausted" in error_str:
                return {
                    "intent": "faq",
                    "reply": f"The AI assistant is receiving too many requests right now. Please wait a few moments and try again.{availability_suggestion}"
                }

            if ("503" in error_str or "unavailable" in error_str) and attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff: 1s, 2s, 4s
                continue
            return {
                "intent": "faq",
                "reply": f"I'm sorry, the AI service is temporarily busy. Please try again in a moment. [DEBUG: {str(e)}]"
            }
