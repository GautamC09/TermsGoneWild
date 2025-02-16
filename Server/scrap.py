import requests
from bs4 import BeautifulSoup
import tiktoken
import time

def get_all_text(url):
    # Send an HTTP request to the URL and get the HTML content
    response = requests.get(url)
    
    # Check if the request was successful (status code 200)
    if response.status_code != 200:
        print(f"Failed to retrieve the webpage. Status code: {response.status_code}")
        return None
    
    # Parse the HTML content with BeautifulSoup
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Get all the text from the page
    text = soup.get_text()
    
    # Clean up the text (remove extra whitespace)
    cleaned_text = ' '.join(text.split())
    
    return cleaned_text

# Example usage
url = 'https://redditinc.com/policies/user-agreement'  # Replace with your desired URL
page_text = get_all_text(url)


with open('output.txt', 'w', encoding='utf-8') as f:
    f.write(page_text)

print(page_text)

def split_text(page_text, model="gpt-4-turbo", max_tokens=4000):
    enc = tiktoken.encoding_for_model(model)
    tokens = enc.encode(page_text)
    
    chunks = []
    for i in range(0, len(tokens), max_tokens):
        chunk = enc.decode(tokens[i : i + max_tokens])
        chunks.append(chunk)
    
    return chunks


GROQ_API_KEY = "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"
GROQ_MODEL = "llama-3.3-70b-versatile"

TOKEN_LIMIT = 3000  # Set to ~3000 to avoid hitting 6000 TPM limit

# Function to estimate tokens and split text accordingly
def split_text(text, max_tokens=TOKEN_LIMIT):
    words = text.split()  # Split by words (approx. 1.5 words = 1 token)
    
    chunks = []
    current_chunk = []
    current_token_count = 0

    for word in words:
        current_chunk.append(word)
        current_token_count += 1

        if current_token_count >= max_tokens:
            chunks.append(" ".join(current_chunk))
            current_chunk = []
            current_token_count = 0

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks

# Function to analyze Terms & Conditions with delay handling
def analyze_terms_with_groq(text):
    url = "https://api.groq.com/openai/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    chunks = split_text(text)  # Split text manually
    results = []

    for idx, chunk in enumerate(chunks):
        payload = {
            "model": GROQ_MODEL,
            "messages": [
                {"role": "system", "content": "You are a legal expert analyzing Terms & Conditions."},
                {"role": "user", "content": f"Analyze this section of Terms & Conditions:\n\n{chunk}\n\n"
                                            "Highlight any clauses that:\n"
                                            "Identify and analyze clauses that may be concerning for users, specifically looking for:\n\n1. Privacy Issues:\n- Data collection beyond necessary scope\n- Sharing of personal information with third parties\n- Unclear data retention policies\n- Tracking and surveillance practices\n\n2. Financial Concerns:\n- Hidden or unexpected fees\n- Automatic renewal terms\n- Unclear pricing structures\n- Cancellation penalties\n\n3. Legal Rights:\n- Mandatory arbitration clauses\n- Class action lawsuit waivers\n- Unilateral terms modification\n- Liability limitations\n\n4. Unclear or Unfair Terms:\n- Vague or ambiguous language\n- One-sided obligations\n- Unreasonable restrictions\n- Termination clauses\n"
                                            "Give only cluses that have high risks and are likely to cause issues for users.\n"
                                            "Provide JSON response with:\n"
                                            "- The clause\n"
                                            "- The concern\n"
                                            "- Risk level (Low, Medium, High)\n"
                                            "- Explanation"}
            ],
            "temperature": 0.2
        }

        while True:  # Keep retrying if rate limit error occurs
            response = requests.post(url, headers=headers, json=payload)
            
            if response.status_code == 200:
                result = response.json()["choices"][0]["message"]["content"]
                results.append(result)
                print(f"\n🔹 **Chunk {idx+1} Response:**\n{result}\n")
                break  # Exit retry loop

            elif "rate_limit_exceeded" in response.text:
                wait_time = 20  # Adjust based on Groq error message
                print(f"🚨 Rate limit exceeded. Waiting {wait_time}s before retrying...")
                time.sleep(wait_time)

            else:
                print(f"❌ Error: {response.text}")
                return None

    final_output = "\n\n".join(results)
    return final_output


response = analyze_terms_with_groq(page_text)
print( response)  