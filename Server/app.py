from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time
import re
from groq import Groq
import os
import dotenv
import json
from flask import Flask, jsonify, request
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

dotenv.load_dotenv()

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def scrape_website_text(url):
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")

    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        driver.get(url)
        time.sleep(3)
        body_text = driver.find_element(By.TAG_NAME, "body").text
        cleaned_text = clean_text(body_text)
        return cleaned_text
    
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return None
    
    finally:
        driver.quit()

def clean_text(text):
    text = re.sub(r'\n+', '\n', text).strip()
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'\{.*?\}', '', text)
    text = re.sub(r'<[^>]+>', '', text)
    return text

def split_text(text, max_length=6000):
    """Split text into chunks for LLM processing"""
    words = text.split()
    chunks = []
    current_chunk = []
    current_length = 0
    
    for word in words:
        if current_length + len(word) > max_length:
            chunks.append(" ".join(current_chunk))
            current_chunk = [word]
            current_length = len(word)
        else:
            current_chunk.append(word)
            current_length += len(word) + 1
    if current_chunk:
        chunks.append(" ".join(current_chunk))
    return chunks

def analyze_terms_with_groq(text_chunk, url):
    """Send text chunk to Groq API for analysis"""
    prompt = """
    You are a legal analysis assistant. Your task is to analyze the provided text and determine if it is from a terms and conditions or privacy policy page. If it is not, respond with a message indicating that the provided link is not valid for analysis.

    Website Link: {url}

    Text to Analyze:
    {text}

    Instructions:
    1. Check if the text is from a terms and conditions or privacy policy page.
    2. If it is not, respond with: "This page does not appear to be a terms and conditions or privacy policy page. Please provide a valid link."
    3. If it is, analyze the text and highlight any clauses that have privacy issues, financial concerns, legal risks, or unfair terms.
    4. Format your response ONLY as a valid JSON array of objects, where each object has these exact fields:
       - "Clause": the exact text of the concerning clause
       - "Concern": the category of concern (privacy, financial, legal, unfair)
       - "Risk Level": assessment as "Low", "Medium", or "High"
       - "Explanation": brief explanation of the issue
    5. If no concerning clauses are found, return [].

    VERY IMPORTANT: Your entire response must be ONLY the JSON array with no additional text, comments, or explanation.
    """

    try:
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile", 
            messages=[
                {"role": "system", "content": "You are a legal analysis assistant that only responds with valid JSON."},
                {"role": "user", "content": prompt.format(url=url, text=text_chunk)}
            ],
            max_tokens=6000,
            temperature=0.1
        )
        
        # Get the response content
        content = response.choices[0].message.content.strip()
        
        # Check if the response is a plain text message (invalid page)
        if "This page does not appear to be a terms and conditions or privacy policy page" in content:
            return None  # Indicate that the page is not valid for analysis
        
        # Try to parse the JSON
        try:
            # Find JSON array in the response if it's not a clean JSON
            if not content.startswith('['):
                match = re.search(r'\[(.*?)\]', content, re.DOTALL)
                if match:
                    content = match.group(0)
            
            # Parse the JSON
            json_data = json.loads(content)
            return json_data
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {str(e)}")
            print(f"Raw response: {content}")
            return []
            
    except Exception as e:
        print(f"API error: {str(e)}")
        return []
    
@app.route('/api/analyze', methods=['POST'])
def analyze_url():
    data = request.json
    url = data.get('url')
    
    if not url:
        return jsonify({"error": "URL is required"}), 400
    
    full_text = scrape_website_text(url)
    
    if full_text:
        print(f"Total words: {len(full_text.split())}")
        text_chunks = split_text(full_text)
        print(f"Analyzing {len(text_chunks)} chunks of text...")
        
        all_analyses = []
        invalid_page = False
        
        for i, chunk in enumerate(text_chunks):
            print(f"\nAnalyzing chunk {i + 1}/{len(text_chunks)}...")
            analysis = analyze_terms_with_groq(chunk, url)  # Pass the URL to the function
            
            if analysis is None:
                # The page is not a valid terms and conditions or privacy policy page
                invalid_page = True
                break
            elif analysis:
                print(f"Found {len(analysis)} concerning clauses")
                all_analyses.extend(analysis)
            else:
                print("No concerning clauses found in this chunk")
        
        if invalid_page:
            print("\nThe provided link is not a valid terms and conditions or privacy policy page.")
            return jsonify({"error": "The provided link is not a valid terms and conditions or privacy policy page."}), 400
        elif all_analyses:
            print(f"\nAnalysis complete. Found {len(all_analyses)} concerning clauses in total.")
            return jsonify(all_analyses)
        else:
            print("\nNo concerning clauses found in the entire document.")
            return jsonify([])
    else:
        return jsonify({"error": "Failed to scrape the website"}), 500
    
@app.route('/api/summary', methods=['POST'])
def generate_summary():
    data = request.json
    analysis_results = data.get('analysis_results')
    
    if not analysis_results:
        return jsonify({"error": "Analysis results are required"}), 400
    
    # Prepare the prompt for the LLM
    prompt = """
    Analyze the following clauses and generate a plain text summary:

    {analysis_results}

    The summary should include:
    1. A breakdown of concerns by category (privacy, financial, legal, unfair).
    2. The total number of clauses for each concern category.
    3. The distribution of risk levels (Low, Medium, High).
    4. Any notable patterns or recurring issues.
    5. A clear explanation of the risks and a recommendation on whether the user should agree to the terms or not.

    IMPORTANT: Your response should be in plain text and should NOT include any JSON formatting or code blocks.
    """

    try:
        # Send the analysis results to the LLM for summarization
        response = groq_client.chat.completions.create(
            model="mistral-saba-24b", 
            messages=[
                {"role": "system", "content": "You are a legal analysis assistant that generates plain text summary reports."},
                {"role": "user", "content": prompt.format(analysis_results=json.dumps(analysis_results))}
            ],
            max_tokens=6000,
            temperature=0.1
        )
        
        # Get the response content
        content = response.choices[0].message.content.strip()
        
        # Return the plain text summary
        return jsonify({"summary": content}), 200
            
    except Exception as e:
        print(f"API error: {str(e)}")
        return jsonify({"error": "Failed to generate summary"}), 500
    

# For direct script execution (development)
if __name__ == "__main__":
    app.run(debug=True, port=5000)