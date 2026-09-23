from fastapi import APIRouter, HTTPException
from app.models.api import ChatRequest, ChatResponse, AvailabilityRequest, RoomAvailability, AvailabilityContext
from app.services.gemini_service import process_chat
from app.services.supabase_service import check_availability
from datetime import date

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    try:
        # Pass availability context to Gemini so it understands conversation state
        avail_ctx_dict = None
        if request.availability_context:
            avail_ctx_dict = request.availability_context.model_dump()
        
        ai_response = process_chat(request.message, request.conversation, avail_ctx_dict)
        
        intent = ai_response.get("intent", "faq")
        reply = ai_response.get("reply", "I'm sorry, I couldn't understand that.")
        
        availability_results = None
        response_context = None
        
        if intent in ["availability", "availability_followup"]:
            # Start with existing context or empty
            existing = {}
            if request.availability_context and request.availability_context.active:
                existing = {
                    "check_in": request.availability_context.check_in,
                    "check_out": request.availability_context.check_out,
                    "adults": request.availability_context.adults,
                    "room_type": request.availability_context.room_type,
                    "preferred_check_in_time": request.availability_context.preferred_check_in_time,
                    "preferred_check_out_time": request.availability_context.preferred_check_out_time,
                }
            
            # Merge: Gemini's new extractions fill in missing fields
            merged_check_in = ai_response.get("check_in") or existing.get("check_in")
            merged_check_out = ai_response.get("check_out") or existing.get("check_out")
            merged_adults = ai_response.get("adults") or existing.get("adults")
            merged_room_type = ai_response.get("room_type") or existing.get("room_type")
            merged_pref_in = ai_response.get("preferred_check_in_time") or existing.get("preferred_check_in_time")
            merged_pref_out = ai_response.get("preferred_check_out_time") or existing.get("preferred_check_out_time")
            
            # Build the updated context to return to frontend
            response_context = AvailabilityContext(
                active=True,
                check_in=merged_check_in,
                check_out=merged_check_out,
                adults=merged_adults,
                room_type=merged_room_type,
                preferred_check_in_time=merged_pref_in,
                preferred_check_out_time=merged_pref_out,
            )
            
            # If all required fields are present, call availability
            if merged_check_in and merged_check_out and merged_adults:
                try:
                    check_in_date = date.fromisoformat(merged_check_in)
                    check_out_date = date.fromisoformat(merged_check_out)
                    
                    if check_in_date >= check_out_date:
                        reply = "It looks like the check-out date is before or the same as check-in. Could you provide a valid check-out date after the check-in date?"
                    else:
                        rooms = check_availability(check_in_date, check_out_date, merged_adults)
                        if rooms:
                            availability_results = [RoomAvailability(**r) for r in rooms]
                            reply = f"Great news! I found {len(availability_results)} available room type{'s' if len(availability_results) > 1 else ''} for your stay from {merged_check_in} to {merged_check_out}.\n\nIs there anything else I can help you with? I would be very happy to answer."
                        else:
                            reply = f"I'm sorry, I couldn't find any available rooms from {merged_check_in} to {merged_check_out} for {merged_adults} adult{'s' if merged_adults > 1 else ''}. Would you like to try different dates? Is there anything else I can help you with? I would be very happy to answer."
                        
                        # Reset context after successful lookup
                        response_context = AvailabilityContext(active=False)
                        
                except ValueError:
                    reply = "I had trouble understanding the dates. Could you please provide your dates in a format like September 24, 2026?"
                except Exception as e:
                    print(f"Error checking availability from chat: {e}")
                    reply = "I'm unable to check room availability right now. Please try again in a moment."
            else:
                # If we are missing fields and it's a followup or clarification
                if ai_response.get("needs_clarification") or ai_response.get("contains_time") or intent == "availability_followup":
                    missing = []
                    if not merged_check_out: missing.append("check-out date")
                    if not merged_adults: missing.append("number of adults staying")
                    if not merged_check_in: missing.append("check-in date")
                    
                    if missing:
                        reply = f"I still need your {' and '.join(missing)}.\nFor example: September 28, 2 adults."
        else:
            # FAQ intent — preserve any existing availability context so user can resume
            if request.availability_context and request.availability_context.active:
                response_context = request.availability_context
                
                missing = []
                if not response_context.check_out: missing.append("check-out date")
                if not response_context.adults: missing.append("number of adults staying")
                if not response_context.check_in: missing.append("check-in date")
                
                if missing:
                    reply += f"\n\nYour availability search is still in progress. I still need your {' and '.join(missing)}."
        
        return ChatResponse(
            reply=reply,
            intent=intent,
            availability=availability_results,
            availability_context=response_context,
        )
    except Exception as e:
        print(f"Error in chat_endpoint: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while processing the chat.")

@router.post("/availability", response_model=list[RoomAvailability])
def availability_endpoint(request: AvailabilityRequest):
    try:
        if request.check_in >= request.check_out:
            raise HTTPException(status_code=400, detail="Check-out date must be after check-in date.")
            
        available_rooms = check_availability(
            request.check_in,
            request.check_out,
            request.adults
        )
        
        # RoomAvailability matches the dict format returned by check_availability
        return available_rooms
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error in availability_endpoint: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while checking availability.")
