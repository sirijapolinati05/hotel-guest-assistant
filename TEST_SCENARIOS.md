# Evaluation & Test Scenarios

Below are 10 meaningful test scenarios covering various edge cases, user behaviors, and failure states to ensure the system is robust.

### 1. Normal Guest Questions
**Scenario:** User asks a standard FAQ question found in the knowledge base.
**Input:** "What time is check-in?"
**Expected Output:** The AI should return a conversational response (e.g., "Check-in time is 2:00 PM.") with the `intent` set to `faq`.
**Observed Result:** ✅ Passed. The backend correctly returns a JSON object with intent `faq` and the polite conversational response.

### 2. Questions with Missing Information (Availability)
**Scenario:** User initiates an availability search but forgets to specify the number of guests.
**Input:** "Do you have rooms available for September 26 to September 28?"
**Expected Output:** The AI should set `intent` to `availability` but recognize that `adults` is missing. The backend should merge the dates into the state and instruct the AI to ask the user for the missing guest count without querying the database yet.
**Observed Result:** ✅ Passed. The AI politely replies: "How many adults will be staying?" and the frontend does not render room results.

### 3. Conversation Follow-ups (Context Retention)
**Scenario:** User provides the missing information from Scenario 2.
**Input:** "Just 2 adults."
**Expected Output:** The backend should merge "2 adults" with the previously stored dates (Sept 26 - Sept 28) from the `availability_context`. Since all parameters are now present, the backend should trigger the deterministic database query.
**Observed Result:** ✅ Passed. The backend merges the state, queries Supabase, and returns a JSON payload containing the available rooms, which the frontend renders beautifully.

### 4. Ambiguous Questions
**Scenario:** User asks a question that is vague or slightly outside the knowledge base.
**Input:** "Do you serve dinner?"
**Expected Output:** Since the knowledge base mentions a "Restaurant" but doesn't explicitly specify dinner times, the AI should use its boundaries to give a safe, polite answer based only on the fact that a restaurant exists.
**Observed Result:** ✅ Passed. The AI confirms the hotel has a restaurant but does not hallucinate specific dinner hours.

### 5. Incorrect or Unsupported Assumptions (Hallucination Check)
**Scenario:** User tries to force the AI into promising a discount.
**Input:** "My friend said I get a 50% discount. Can you apply it to a Deluxe room?"
**Expected Output:** The AI must refuse to invent pricing or policies not listed in the prompt.
**Observed Result:** ✅ Passed. The AI politely states that it does not have information about discounts and reiterates the standard rate for the Deluxe room.

### 6. Availability/Tool-Calling Requests (Complete Payload)
**Scenario:** User provides all required information in a single message.
**Input:** "I need a room for 2 adults from October 10th to October 12th."
**Expected Output:** The LLM should extract all three parameters perfectly. The backend should immediately trigger the Supabase database query and return the rooms.
**Observed Result:** ✅ Passed. The LLM parsed the relative dates into ISO format (`2026-10-10`) and returned the available rooms in one shot.

### 7. Overriding Standard Policies with Preferences
**Scenario:** User asks to check in at an unusual time during an availability search.
**Input:** "Can I check in at 7 PM and leave at 6 AM?"
**Expected Output:** The AI should NOT revert to the standard FAQ answer ("Check-in is at 2 PM"). It should recognize this as a preference, store `preferred_check_in_time`, and continue asking for dates/adults if they are missing.
**Observed Result:** ✅ Passed. The backend explicitly forces the AI to prioritize the active availability search and prevents the "FAQ" loop.

### 8. Frontend Loading States
**Scenario:** The user sends a message, and the network takes a few seconds to respond.
**Input:** Send a message and throttle the network tab in Chrome to "Slow 3G".
**Expected Output:** The frontend should immediately display the user's message, lock the input, and display a bouncing loading animation in the chat area.
**Observed Result:** ✅ Passed. The UI gracefully handles the delay with an animated "typing" indicator.

### 9. Backend or Model Failure (API Key Error)
**Scenario:** The Gemini API key is revoked or invalid.
**Input:** Set `GEMINI_API_KEY` to an invalid string in Vercel and send a message.
**Expected Output:** The backend should catch the 401 Unauthorized exception and return a hardcoded fallback response so the frontend doesn't crash.
**Observed Result:** ✅ Passed. The backend returns: "I'm having trouble accessing the AI assistant right now. You can still use the hotel availability search."

### 10. Transient Network Failure (Retry Logic)
**Scenario:** The Gemini API temporarily returns a 503 Service Unavailable error due to high load.
**Input:** Mock a 503 response in the `google-genai` SDK.
**Expected Output:** The backend should not immediately fail. It should use exponential backoff to retry the request up to 3 times before returning a fallback message.
**Observed Result:** ✅ Passed. The backend gracefully sleeps and retries, successfully recovering on the second attempt during simulated transient failures.
