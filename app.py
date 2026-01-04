from flask import Flask, send_file, jsonify, request
import requests
import os

app = Flask(__name__, static_folder=None)

# In-memory storage for models
# These are standard models supported by Puter. 
# In a real scenario, we might fetch these from an API if available.
AVAILABLE_MODELS = [
    {"id": "gpt-4o", "name": "GPT-4o", "provider": "OpenAI", "icon": "⚡"},
    {"id": "gpt-4o-mini", "name": "GPT-4o Mini", "provider": "OpenAI", "icon": "🚀"},
    {"id": "claude-sonnet-4.5", "name": "Claude Sonnet 4.5", "provider": "Anthropic", "icon": "🧠"},
    {"id": "gemini-1.5-pro", "name": "Gemini 1.5 Pro", "provider": "Google", "icon": "💎"},
    {"id": "meta-llama/llama-3.1-70b-instruct", "name": "Llama 3.1 70B", "provider": "Meta", "icon": "🦙"},
    {"id": "mistral-large-latest", "name": "Mistral Large", "provider": "Mistral", "icon": "🌪️"}
]

@app.route('/')
def index():
    return send_file('index.html')

@app.route('/style.css')
def style():
    return send_file('style.css')

@app.route('/script.js')
def script():
    return send_file('script.js')

@app.route('/models', methods=['GET'])
def get_models():
    return jsonify(AVAILABLE_MODELS)

# Chat endpoint removed in favor of client-side Puter.js
# to allow usage without API Key.

if __name__ == '__main__':
    # Run on port 5000 as required
    app.run(host='0.0.0.0', port=5000, debug=True)
