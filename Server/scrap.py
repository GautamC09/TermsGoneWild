from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
from typing import Tuple, Optional, List
import json
from tenacity import retry, stop_after_attempt, wait_fixed
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time

app = Flask(__name__)
CORS(app)

# Configuration as constants
CONFIG = {
    "GROQ_API_KEY": "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",
    "GROQ_MODEL": "llama-3.3-70b-versatile",
    "TOKEN_LIMIT": 3000,
    "MAX_RETRIES": 3,
    "RETRY_DELAY": 20
}

# Session for better connection pooling
session = requests.Session()

def get_all_text(url: str) -> Tuple[Optional[str], Optional[str]]:
    """Extract and clean text from a webpage using Selenium if requests fails."""
    # First try with requests
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        response = session.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        text = soup.get_text(separator=' ')
        return ' '.join(text.split()), None
    except requests.RequestException as e:
        print(f"Requests failed: {str(e)}. Trying Selenium...")
        
        # Fallback to Selenium
        try:
            options = Options()
            options.add_argument("--headless")  # Run without UI
            options.add_argument("--disable-gpu")
            options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
            driver = webdriver.Chrome(options=options)
            driver.get(url)
            time.sleep(2)  # Wait for page to load
            text = driver.find_element("tag name", "body").text
            driver.quit()
            return ' '.join(text.split()), None
        except Exception as e:
            return None, f"Failed to retrieve webpage: {str(e)}. Please try pasting the text manually."

def split_text(text: str, max_tokens: int = CONFIG["TOKEN_LIMIT"]) -> List[str]:
    """Split text into token-limited chunks efficiently."""
    words = text.split()
    return [' '.join(words[i:i + max_tokens]) 
            for i in range(0, len(words), max_tokens)]

@retry(stop=stop_after_attempt(CONFIG["MAX_RETRIES"]), 
       wait=wait_fixed(CONFIG["RETRY_DELAY"]))
def make_groq_request(payload: dict) -> str:
    """Make API request to Groq with retry logic."""
    headers = {
        "Authorization": f"Bearer {CONFIG['GROQ_API_KEY']}",
        "Content-Type": "application/json"
    }
    response = session.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers=headers,
        json=payload,
        timeout=30
    )
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]

def analyze_terms(text: str) -> Tuple[Optional[str], Optional[str]]:
    """Analyze Terms & Conditions text."""
    try:
        chunks = split_text(text)
        results = []
        
        system_prompt = "You are a legal expert analyzing Terms & Conditions."
        user_prompt_template = (
            "Analyze this section:\n\n{content}\n\n"
            "Highlight any clauses that have privacy issues, financial concerns, "
            "legal risks, or unfair terms.\n"
            "Return a JSON array of objects Phases, where each object has:\n"
            "- Clause\n- Concern\n- Risk Level (Low, Medium, High)\n- Explanation\n"
            "Do not wrap the array in an outer object like 'Clauses'. Example:\n"
            "[{\"Clause\": \"example\", \"Concern\": \"privacy\", \"Risk Level\": \"Low\", \"Explanation\": \"details\"}]"
        )

        for chunk in chunks:
            payload = {
                "model": CONFIG["GROQ_MODEL"],
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt_template.format(content=chunk)}
                ],
                "temperature": 0.2
            }
            
            result = make_groq_request(payload)
            try:
                parsed_result = json.loads(result)
                if isinstance(parsed_result, list):
                    results.extend(parsed_result)
                else:
                    return None, f"Invalid JSON format from Groq, expected array: {result}"
            except json.JSONDecodeError:
                return None, f"Invalid JSON response from Groq: {result}"

        return json.dumps(results), None
    except Exception as e:
        return None, f"Analysis failed: {str(e)}"

@app.route('/analyze', methods=['POST'])
def analyze():
    """API endpoint to analyze URL content or manually provided text."""
    try:
        data = request.get_json()
        if not data or ("url" not in data and "text" not in data):
            return jsonify({"error": "URL or text is required"}), 400

        # Use provided text or fetch from URL
        if "text" in data and data["text"]:
            text = data["text"]
        else:
            text, error = get_all_text(data["url"])
            if error:
                return jsonify({"error": error}), 400

        analysis, error = analyze_terms(text)
        if error:
            return jsonify({"error": error}), 500

        return jsonify({"analysis": json.loads(analysis)})
    
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e.Find)}"}), 500

if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=5000)