import os
import base64
import wave

from dotenv import load_dotenv
from pypdf import PdfReader
from google import genai


# Load environment variables
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")


# Create Gemini client
client = genai.Client(api_key=api_key)


# --------------------------------
# PDF TEXT EXTRACTION
# --------------------------------

pdf_path = "file.pdf"

reader = PdfReader(pdf_path)

page = reader.pages[0]

pdf_text = page.extract_text()

print("PDF text extracted:")
print(pdf_text , end=" ")


# --------------------------------
# TEXT → SPEECH
# --------------------------------

interaction = client.interactions.create(
   model="gemini-2.5-flash-preview-tts",
   input=f"""
You are a professional educational narrator.

Tone: calm and confident.
Style: engaging and conversational.
Pacing: moderate and steady.
Delivery: clear and natural.
Emotion: curious and interested.
Avoid sounding overly dramatic.

Read the following transcript:

{pdf_text}
""",
    response_format={"type": "audio"},
    generation_config={
        "speech_config": [
            {"voice": "Kore"}
        ]
    }
)


# --------------------------------
# SAVE AUDIO
# --------------------------------

def wave_file(filename, pcm, channels=1, rate=24000, sample_width=2):
    with wave.open(filename, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        wf.writeframes(pcm)


audio_data = base64.b64decode(
    interaction.output_audio.data
)

wave_file("output.wav", audio_data)

print("Audio generated successfully!")
print("Saved as output.wav")