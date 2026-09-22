from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from pypdf import PdfReader
from google import genai
from dotenv import load_dotenv

import os
import base64
import wave
from werkzeug.utils import secure_filename


# -----------------------------
# Load environment variables
# -----------------------------

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set")


# -----------------------------
# Initialize Flask
# -----------------------------

app = Flask(__name__)
CORS(app)


# -----------------------------
# Configuration
# -----------------------------

UPLOAD_FOLDER = "uploads"
AUDIO_FOLDER = "audio"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(AUDIO_FOLDER, exist_ok=True)


# -----------------------------
# Initialize Gemini
# -----------------------------

client = genai.Client(api_key=api_key)


# -----------------------------
# WAV file helper
# -----------------------------

def wave_file(
    filename,
    pcm,
    channels=1,
    rate=24000,
    sample_width=2
):
    with wave.open(filename, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        wf.writeframes(pcm)


# -----------------------------
# Upload PDF + Generate Audio
# -----------------------------

@app.route("/upload", methods=["POST"])
def upload_pdf():

    try:

        # 1. Check file
        if "pdf" not in request.files:
            return jsonify({
                "error": "No PDF file uploaded"
            }), 400

        pdf = request.files["pdf"]

        # 2. Check filename
        if pdf.filename == "":
            return jsonify({
                "error": "No file selected"
            }), 400

        # 3. Check extension
        if not pdf.filename.lower().endswith(".pdf"):
            return jsonify({
                "error": "Only PDF files are allowed"
            }), 400

        # 4. Secure filename
        filename = secure_filename(pdf.filename)

        file_path = os.path.join(
            UPLOAD_FOLDER,
            filename
        )

        # 5. Save PDF
        pdf.save(file_path)

        print("PDF saved:", file_path)


        # -----------------------------
        # Extract PDF text
        # -----------------------------

        reader = PdfReader(file_path)

        # Currently one-page PDFs only
        if len(reader.pages) != 1:
            return jsonify({
                "error": "Currently only one-page PDFs are supported"
            }), 400

        page = reader.pages[0]

        text = page.extract_text()

        if not text or not text.strip():
            return jsonify({
                "error": "No text could be extracted from the PDF"
            }), 400

        text = text.strip()

        print("\nExtracted text:")
        print(text)


        # -----------------------------
        # Send text to Gemini TTS
        # -----------------------------

        interaction = client.interactions.create(
            model="gemini-2.5-flash-preview-tts",
            input=text,
            response_format={
                "type": "audio"
            },
            generation_config={
                "speech_config": [
                    {
                        "voice": "Despina"
                    }
                ]
            }
        )


        # -----------------------------
        # Decode Gemini audio
        # -----------------------------

        audio_data = base64.b64decode(
            interaction.output_audio.data
        )


        # -----------------------------
        # Save audio
        # -----------------------------

        audio_path = os.path.join(
            AUDIO_FOLDER,
            "output.wav"
        )

        wave_file(
            audio_path,
            audio_data
        )

        print("Audio generated:", audio_path)


        # -----------------------------
        # Return audio to frontend
        # -----------------------------

        return send_file(
            audio_path,
            mimetype="audio/wav",
            as_attachment=False,
            download_name="output.wav"
        )


    except Exception as error:

        print("ERROR:", error)

        return jsonify({
            "error": str(error)
        }), 500


# -----------------------------
# Run server
# -----------------------------

if __name__ == "__main__":
    app.run(
        debug=True,
        port=5000
    )