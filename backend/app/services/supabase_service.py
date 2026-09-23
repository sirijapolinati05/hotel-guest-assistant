from supabase import create_client, Client
from app.core.config import settings
from typing import List, Dict, Any
from datetime import date

# Initialize Supabase client
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

def check_availability(check_in: date, check_out: date, adults: int) -> List[Dict[str, Any]]:
    # Validate dates in the caller, but ensure check_in < check_out
    if check_in >= check_out:
        return []
    
    # 1. Get all rooms that can accommodate the adults
    rooms_response = supabase.table("rooms").select("*").gte("max_guests", adults).execute()
    eligible_rooms = rooms_response.data
    
    if not eligible_rooms:
        return []
        
    room_ids = [r["id"] for r in eligible_rooms]
    
    # 2. Get inventory for those rooms between check_in (inclusive) and check_out (exclusive)
    # The check_out date is the day they leave, so they don't consume inventory on that day.
    inventory_response = supabase.table("room_inventory") \
        .select("*") \
        .in_("room_id", room_ids) \
        .gte("date", check_in.isoformat()) \
        .lt("date", check_out.isoformat()) \
        .execute()
        
    inventory_data = inventory_response.data
    
    # Calculate days
    delta_days = (check_out - check_in).days
    
    # 3. Find which rooms are available for ALL days
    available_rooms = []
    
    for room in eligible_rooms:
        room_id = room["id"]
        room_inventory = [inv for inv in inventory_data if inv["room_id"] == room_id]
        
        # If we don't have inventory records for all days, it's not fully available
        if len(room_inventory) < delta_days:
            continue
            
        # Check if there is availability on every single day
        min_available = float('inf')
        for inv in room_inventory:
            available = inv["total_count"] - inv["booked_count"]
            if available <= 0:
                min_available = 0
                break
            if available < min_available:
                min_available = available
                
        if min_available > 0:
            available_rooms.append({
                "id": room["id"],
                "name": room["name"],
                "price_per_night": room["price_per_night"],
                "beds": room["beds"],
                "max_guests": room["max_guests"],
                "available_count": min_available
            })
            
    return available_rooms
