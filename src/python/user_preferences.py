from agents import Agent, Runner
import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if OPENAI_API_KEY is None:
    raise ValueError("OPENAI_API_KEY is not set in the environment variables.")

welcome_agent = Agent(
    name="Welcome Assistant",
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

house_preferences_agent = Agent(
    name="House Preferences Manager",
    instructions="""
You are a house preferences manager responsible for maintaining and updating the shared house rules and preferences.
Your job is to:
1. Create initial house preferences when the first person joins
2. Update and merge preferences when new housemates join
3. Resolve conflicts between different preferences
4. Maintain a clear, organized set of house rules

When receiving a new housemate's preferences:
1. If this is the first person (no existing preferences), create a new set of house preferences
2. If there are existing preferences, carefully merge the new preferences with existing ones
3. Highlight any conflicts that need to be discussed
4. Provide a clear summary of the updated house preferences

Format your responses in a clear, structured way that can be easily referenced by all housemates.
"""
)

# Initialize conversation histories
welcome_chat_history = []
house_preferences_history = []

# Function to handle the welcome conversation and get preferences
def run_welcome_conversation(messages=None):
    # Initialize with welcome message if no messages exist
    if not welcome_chat_history:
        welcome_chat_history.append({
            "role": "assistant",
            "content": "Welcome to your new home! I'm here to help make your transition smooth and ensure everyone's preferences are considered. Let's start by discussing your preferences for living together. I'll ask you about different aspects of shared living, and we'll work through them one by one."
        })

    if messages is None:
        # Interactive mode
        if len(welcome_chat_history) == 1:  # Only welcome message exists
            welcome_chat_history.append({"role": "user", "content": "Hi! I'm moving in this week."})
        
        while True:
            result = Runner.run_sync(welcome_agent, welcome_chat_history)
            assistant_reply = result.final_output.strip()
            print(f"\n{welcome_agent.name}: {assistant_reply}")

            if "summary" in assistant_reply.lower() or "all set" in assistant_reply.lower() or "welcome again" in assistant_reply.lower():
                return assistant_reply  # Return the final summary

            user_input = input("\nYou: ").strip()
            welcome_chat_history.append({"role": "assistant", "content": assistant_reply})
            welcome_chat_history.append({"role": "user", "content": user_input})
    else:
        # Server mode
        if len(messages) == 1 and messages[0]["role"] == "user":  # Only initial user message
            welcome_chat_history.extend(messages)
            result = Runner.run_sync(welcome_agent, welcome_chat_history)
            return result.final_output.strip()
        else:
            # If we have a conversation history, use it
            welcome_chat_history.extend(messages)
            result = Runner.run_sync(welcome_agent, welcome_chat_history)
            return result.final_output.strip()

# Function to update house preferences
def update_house_preferences(messages=None):
    if messages is None:
        # Interactive mode
        print("\nUpdating house preferences...")
        house_preferences_history.append({
            "role": "user",
            "content": "New housemate preferences to integrate:\n" + welcome_chat_history[-1]["content"]
        })
    else:
        # Server mode
        house_preferences_history.extend(messages)
    
    result = Runner.run_sync(house_preferences_agent, house_preferences_history)
    updated_preferences = result.final_output.strip()
    
    house_preferences_history.append({
        "role": "assistant",
        "content": updated_preferences
    })
    
    return updated_preferences

# Only run interactive mode if this file is run directly
if __name__ == "__main__":
    print("Welcome to your new F.L.A.T system! Designed to take the stress out of living with housemates.")
    print("Let's start by collecting your preferences...")
    
    # Get preferences from new housemate
    new_preferences = run_welcome_conversation()
    
    # Update house preferences
    print("\nUpdating house preferences...")
    updated_preferences = update_house_preferences()
    print("\nUpdated House Preferences:")
    print(updated_preferences)
