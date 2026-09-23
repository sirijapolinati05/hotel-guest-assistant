# Product & AI Thinking

## What customer problem are you solving?
Guests frequently visit hotel websites to find basic information (check-in times, pool availability, policies) and to check room availability. Traditional websites force users to dig through navigation menus or use rigid date-picker forms. This project solves this by providing a unified, conversational interface. Guests can ask natural questions, get immediate contextual answers, and seamlessly transition into checking availability without leaving the chat.

## What does the guest journey look like?
1. **Discovery**: The guest lands on the website and is greeted by the floating AI Assistant.
2. **Inquiry**: The guest asks a question (e.g., "Do you have a pool?" or "Is breakfast included?").
3. **Contextual Response**: The AI responds conversationally based strictly on the provided hotel knowledge base.
4. **Availability Transition**: The guest asks about booking a room (e.g., "Do you have rooms for 3 adults on Sept 26?").
5. **Data Collection**: The AI intelligently recognizes the availability intent. If any required parameters (check-in, check-out, guests) are missing, it asks conversational follow-up questions to gather them.
6. **Deterministic Fulfillment**: Once all parameters are collected, the frontend displays the available rooms securely fetched from the database, completely bypassing the LLM to prevent hallucination.

## Why did you design the frontend experience the way you did?
- **Unified Interface**: I chose to integrate the availability search directly into the chat stream via rich UI cards. This prevents the user from being redirected to a separate page, maintaining the conversational flow.
- **Visual Feedback**: The frontend includes clear loading states (bouncing dots) and error boundaries to keep the user informed.
- **Premium Aesthetic**: Used warm neutral backgrounds, white cards, dark charcoal typography, and subtle gold accents to reflect the branding of a high-end hotel.

## Which parts should use AI and which parts should remain deterministic?
- **AI (LLM)**: Used exclusively for Natural Language Understanding (NLU). The LLM handles small talk, answers FAQs using the injected knowledge base, and acts as an intent router/entity extractor for availability requests.
- **Deterministic**: The actual availability check, pricing logic, and room database querying are strictly deterministic. The AI extracts the JSON parameters (`check_in`, `check_out`, `adults`), but the backend executes the database query. This ensures guests are never quoted incorrect prices or hallucinated room types.

## What can go wrong with the AI response?
1. **Hallucination**: The AI might invent amenities or promise discounts.
2. **Prompt Injection**: A malicious user might try to make the AI act out of character.
3. **Format Failures**: The AI might fail to return the strictly required JSON format, breaking the frontend.
4. **Latency/Timeouts**: The API might take too long to respond.

## How would you prevent hallucinations or unsupported answers?
1. **Strict System Prompts**: The hotel context is hardcoded into the system prompt with explicit negative constraints (e.g., "NEVER invent hotel facts").
2. **Structured JSON Output**: By forcing the model to output a specific JSON schema (using `response_schema`), we eliminate conversational drift when extracting entities.
3. **Boundary Defenses**: The prompt explicitly instructs the model to provide a polite fallback if the user asks about unrelated topics.

## What should happen when the model, frontend API call, or another dependency fails?
The system is built with multiple fail-safes:
1. **Backend Retry Logic**: If the Gemini API returns a 503 (temporarily unavailable), the backend uses exponential backoff to retry the request automatically.
2. **Backend Fallback**: If the LLM throws an unrecoverable exception (e.g., API key quota exceeded), the backend catches it and returns a hardcoded, friendly JSON response instructing the guest to use the manual search form.
3. **Frontend Error Boundary**: If the network completely fails (e.g., 500 or 404 from the server), the frontend catches the promise rejection and displays a dismissible red error banner directly in the chat window, preventing the UI from freezing.

## How would you measure whether the feature is actually useful?
1. **Engagement Rate**: Track the percentage of website visitors who open the chat and send at least one message.
2. **Conversion Rate**: Track how many availability searches initiated through the AI result in a completed booking compared to the traditional search form.
3. **Fallback Rate**: Monitor how often the AI hits the "I don't have that information" fallback to identify gaps in the knowledge base.

## What would you improve before taking this to production?
1. **RAG (Retrieval-Augmented Generation)**: For a large hotel chain, hardcoding the context into the system prompt won't scale. I would implement a vector database (like Pinecone or pgvector in Supabase) to dynamically retrieve relevant policies based on the user's query.
2. **Streaming Responses**: Implement Server-Sent Events (SSE) so the AI types out the response in real-time, reducing perceived latency.
3. **Booking Integration**: Add a deterministic "Book Now" flow that interacts with a payment gateway directly from the chat UI.
