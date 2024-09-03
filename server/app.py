import asyncio
import websockets
import os
from dotenv import load_dotenv
import google.generativeai as genai
import nltk

nltk.download('vader_lexicon')
from nltk.sentiment.vader import SentimentIntensityAnalyzer

# Load environment variables from .env file
load_dotenv()

# Configure Google Gemini API
api_key = os.getenv("GOOGLE_API_KEY")
if api_key is None:
    raise ValueError("API key not found in environment variables.")
genai.configure(api_key=api_key)

# Initialize sentiment analyzer
sid = SentimentIntensityAnalyzer()

# Create the model with desired configuration
generation_config = {
    "temperature": 2,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)

async def generate_poem_parts(prompt, websocket):
    # Start a chat session with the model
    msg = "Generate any poem on: \""
    chat_session = model.start_chat(history=[])
    prompt = msg + prompt
    prompt += "\"Don't generate anything else as this is to be displayed atomatically."
    prompt += "\n At the end give the rating of the poem based on 4 paramaters happiness, terrifying, grammar, rhyming as happiness-'Value between 0-100' and so on, no headings, poem, paramaters(plain text, no stars): No(plain text), Eg : Happiness: 70\nTerrifying: 23\nGrammar: 13\nRhyming: 54."
    print(prompt)
    response = chat_session.send_message(prompt)
    
    # Process and send each part of the poem as it is generated
    for candidate in response.candidates:
        poem_text = " ".join([part.text for part in candidate.content.parts])
        for sentence in poem_text.split(". "):
            if sentence:
                await websocket.send(sentence.strip() + ".")  # Send each sentence as it's ready
                await asyncio.sleep(0.5) 

async def handle_connection(websocket, path):
    port = int(os.environ.get("PORT", 8765))
    server = await serve(handle_connection, "0.0.0.0", port, 
                         origins=["http://localhost:3000"])  # Add your frontend's URL here
    print(f"WebSocket server started on 0.0.0.0:{port}")
    await server.wait_closed()

async def main():
    server = await websockets.serve(handle_connection, "0.0.0.0", 8765)
    print("WebSocket server started on 0.0.0.0:8765")
    await server.wait_closed()
if __name__ == '__main__':
    asyncio.run(main())
