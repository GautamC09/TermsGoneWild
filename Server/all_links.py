from newspaper import Article
from bs4 import BeautifulSoup
import requests

def get_all_links(url):
    # Fetch the content of the page
    article = Article(url)
    article.download()
    article.parse()
    
    # Get the raw HTML of the page
    html = article.html
    
    # Use BeautifulSoup to parse the HTML
    soup = BeautifulSoup(html, 'html.parser')
    
    # Find all anchor tags and extract the href attribute (links)
    links = []
    for a_tag in soup.find_all('a', href=True):
        link = a_tag['href']
        # Append only if the link is valid
        if link.startswith('http') or link.startswith('https'):
            links.append(link)
    
    return links

# Example usage
url = 'https://redditinc.com/policies/user-agreement'  # Replace with your desired URL
links = get_all_links(url)

for link in links:
    print(link)

print(len(links))