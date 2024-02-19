import argparse
import logging
from flask import Flask, request, jsonify
import os
from bs4 import BeautifulSoup
import requests
import html2text

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')


app = Flask(__name__)

SAVE_DIR = os.environ.get('CONTAINER_MARKDOWN_FILES_FOLDER_PATH')


def html_to_md(html_content: str) -> str:
    """
    Converts HTML content to Markdown.
    """
    h = html2text.HTML2Text()
    h.ignore_links = False
    h.body_width = 0
    return h.handle(html_content)


def save_to_file(filepath: str, content: str) -> None:
    """
    Saves content to a specified file.
    """
    with open(filepath, 'w', encoding='utf-8') as file:
        file.write(content)
    logging.info(f"Content saved to {filepath}")


def scrape_post(post_url: str, save_dir: str) -> None:
    """
    Scrapes a single post from a given URL and saves it as a Markdown file.
    """
    logging.info(f"Starting to scrape post: {post_url}")
    response = requests.get(post_url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        title = soup.find('h1').text if soup.find('h1') else 'Untitled'
        filename = title.replace(' ', '_').lower() + '.md'
        filepath = os.path.join(save_dir, filename)
        content = soup.find('article')
        md_content = html_to_md(str(content))
        save_to_file(filepath, md_content)
    else:
        logging.error(f"Failed to scrape {post_url} with status code {response.status_code}")


@app.route('/scrape', methods=['POST'])
def scrape_and_save():
    logging.info("Received scrape request")
    data = request.json
    if not os.path.exists(SAVE_DIR):
        os.makedirs(SAVE_DIR)
        logging.info(f"Created directory {SAVE_DIR}")

    for title, info in data.items():
        url = info.get('url')
        try:
            scrape_post(url, SAVE_DIR)
        except Exception as e:
            logging.error(f"Error scraping {url}: {e}")
            continue

    logging.info("Scraping complete")
    return jsonify({"message": "Scraping complete", "data": data})


if __name__ == '__main__':
    logging.info("Starting the Flask application")
    app.run(debug=True, host='0.0.0.0', port=os.environ.get('PORT_MS1'))
