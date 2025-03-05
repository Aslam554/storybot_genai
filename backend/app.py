from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)
genai.configure(api_key="AIzaSyB3P1bfWkM8Pku0QOObHUqL0GgV_ETqt_M")

@app.route('/generate', methods=['POST'])
def generate_content():
    data = request.json
    prompt = data.get("prompt", "")
    content_type = data.get("type", "story")

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    model = genai.GenerativeModel("gemini-1.5-pro")

    if content_type == "poem":
        prompt_text = f"Write a short, beautiful poem about: {prompt}"
    else:
        prompt_text = f"Write an engaging short story about: {prompt}"

    try:
        response = model.generate_content(prompt_text)
        result = response.text.strip()

        if content_type == "poem":
            return jsonify({"poem": result})
        else:
            return jsonify({"story": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
