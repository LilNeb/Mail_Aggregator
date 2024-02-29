import argparse
import logging
from flask import Flask, request, jsonify
import os
from bs4 import BeautifulSoup
import requests
import html2text
from datetime import datetime

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
app = Flask(__name__)
SAVE_DIR = os.environ.get('CONTAINER_MARKDOWN_FILES_FOLDER_PATH', 'local-data')

def html_to_md(html_content: str) -> str:
    h = html2text.HTML2Text()
    h.ignore_links = False
    h.body_width = 0
    return h.handle(html_content)

def save_to_file(filepath: str, content: str) -> None:
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as file:
        file.write(content)
    logging.info(f"Content saved to {filepath}")

def scrape_post(post_url: str, category_name: str) -> None:
    logging.info(f"Starting to scrape post: {post_url}")
    response = requests.get(post_url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        title = soup.find('h1').text.strip() if soup.find('h1') else 'Untitled'
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        safe_title = title.replace(' ', '_').replace('/', '_').lower()
        filename = f"{timestamp}_{safe_title}.md"
        
        category_dir = os.path.join(SAVE_DIR, category_name)
        filepath = os.path.join(category_dir, filename)
        
        content = soup.find('article')
        md_content = html_to_md(str(content))
        save_to_file(filepath, md_content)
    else:
        logging.error(f"Failed to scrape {post_url} with status code {response.status_code}")

@app.route('/scrape', methods=['POST'])
def scrape_and_save():
    logging.info("Received scrape request")
    data = request.json
    category_name = data['category']
    posts = data['posts']
    
    for post_title, post_info in posts.items():
        url = post_info['url']
        try:
            scrape_post(url, category_name)
        except Exception as e:
            logging.error(f"Error scraping {url}: {e}")
            continue

    logging.info("Scraping complete")
    return jsonify({"message": "Scraping complete"})

if __name__ == '__main__':
    logging.info("Starting the Flask application")
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT_MS1', 5000)))
