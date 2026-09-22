# PDF to Audio

A simple full-stack web application that converts a one-page text PDF into audio using Google's Gemini Text-to-Speech API.

The user uploads a PDF through the React frontend. The Flask backend extracts the text using `pypdf`, sends the extracted text to Gemini TTS, generates a WAV audio file, and returns the audio to the frontend.

---

## Features

- Upload a one-page PDF
- Extract text from the PDF
- Convert extracted text into speech using Gemini TTS
- Listen to the generated audio directly in the browser
- Download the generated WAV file
- Clean and minimal user interface
- React frontend
- Python Flask backend

---

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- Framer Motion
- Lucide React

### Backend

- Python
- Flask
- Flask-CORS
- pypdf
- Google Gemini API
- python-dotenv

### AI

- Gemini Text-to-Speech
- Model: `gemini-2.5-flash-preview-tts`

---

## Project Architecture

```text
User
 │
 ▼
React Frontend
 │
 │ POST /upload
 ▼
Flask Backend
 │
 ▼
pypdf
 │
 │ Extract text
 ▼
Gemini TTS
 │
 │ Generate speech
 ▼
WAV Audio
 │
 ▼
React Audio Player
 │
 ├── Play
 └── Download