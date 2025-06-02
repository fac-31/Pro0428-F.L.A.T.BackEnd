from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn
from user_preferences import run_welcome_conversation, update_house_preferences
import asyncio
from concurrent.futures import ThreadPoolExecutor

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Add frontend URL when deployed!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Create a thread pool for running sync code
thread_pool = ThreadPoolExecutor()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

@app.get("/api/test")
async def test_route():
    return {"status": "ok", "message": "Python server is running!"}

def run_in_thread(messages):
    # Create a new event loop for this thread
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        return run_welcome_conversation(messages)
    finally:
        loop.close()

@app.post("/api/welcome")
async def welcome_chat(request: ChatRequest):
    try:
        messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
        
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            thread_pool,
            run_in_thread,
            messages
        )

        # Check if the conversation is complete (contains summary or completion indicators)
        if any(indicator in response.lower() for indicator in ["summary", "all set", "welcome again"]):
            # Pass the complete conversation to house preferences
            house_response = await loop.run_in_executor(
                thread_pool,
                update_in_thread,
                messages
            )
            return {
                "response": response,
                "isComplete": True,
                "housePreferences": house_response
            }
        
        return {"response": response, "isComplete": False}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def update_in_thread(messages):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        return update_house_preferences(messages)
    finally:
        loop.close()

if __name__ == "__main__":
    print("Starting F.L.A.T server in API mode...")
    uvicorn.run("server:app", host="localhost", port=8001, reload=True) 