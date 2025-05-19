from agents import Agent, Runner
import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if OPENAI_API_KEY is None:
    raise ValueError("OPENAI_API_KEY is not set in the environment variables.")

agent = Agent(
    name="User Welcoming",
    instructions="""
You are an enthusiastic and helpful onboarding assistant for a new housemate moving into a shared home. 
Your job is to warmly welcome the new person and gather their preferences in a conversational and structured way 
to help the household run smoothly. Be friendly and clear, and make the person feel at ease.

Ask the new housemate for their preferences on the following topics, one at a time:

1. Cleaning routines
2. Sharing personal items
3. Tracking shared usage
4. Bills
5. Bin duties
6. Shared space etiquette
7. Laundry scheduling
8. Heating and air conditioning

Once all answers are collected, provide a friendly summary and end the conversation.
"""
)

# Initialize conversation history
chat_history = [{"role": "user", "content": "Hi! I'm moving in this week."}]

while True:
    result = Runner.run_sync(agent, chat_history)
    assistant_reply = result.final_output.strip()
    print(f"\n{agent.name}: {assistant_reply}")

    # Exit if the summary or goodbye is reached
    if "summary" in assistant_reply.lower() or "all set" in assistant_reply.lower() or "welcome again" in assistant_reply.lower():
        break

    user_input = input("\nYou: ").strip()
    chat_history.append({"role": "assistant", "content": assistant_reply})
    chat_history.append({"role": "user", "content": user_input})
