import argparse
from flask import Flask, request, jsonify
import os
from bs4 import BeautifulSoup
import html2text
import requests

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


def scrape_post(post_url: str, save_dir: str) -> None:
    """
    Scrapes a single post from a given URL and saves it as a Markdown file.
    """
    response = requests.get(post_url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Extract post title for filename
    title = soup.find('h1').text if soup.find('h1') else 'Untitled'
    filename = title.replace(' ', '_').lower() + '.md'
    filepath = os.path.join(save_dir, filename)

    # Convert post content to Markdown
    # Assuming the main content is within <article>
    content = soup.find('article')
    md_content = html_to_md(str(content))

    save_to_file(filepath, md_content)
    print(f"Post saved to {filepath}")


@app.route('/scrape', methods=['POST'])
def scrape_and_save():
    data = request.json
    if not os.path.exists(SAVE_DIR):
        os.makedirs(SAVE_DIR)

    for title, info in data.items():
        url = info.get('url')
        try:
            response = requests.get(url)
            soup = BeautifulSoup(response.content, 'html.parser')
            content = soup.get_text()
            # Simplified content extraction for demonstration; customize as needed

            filename = f"{title.replace(' ', '_').lower()}.md"
            filepath = os.path.join(SAVE_DIR, filename)
            with open(filepath, 'w', encoding='utf-8') as file:
                file.write(content)
        except Exception as e:
            print(f"Error scraping {url}: {e}")
            continue

    return jsonify({"message": "Scraping complete", "data": data})
    data = request.json
    urls = data.get('urls')  # Liste d'URLs
    save_dir = data.get('directory', '.')

    if not os.path.exists(save_dir):
        os.makedirs(save_dir)

    results = []

    for post_url in urls:
        try:
            response = requests.get(post_url)
            soup = BeautifulSoup(response.content, 'html.parser')
            title = soup.find('h1').text if soup.find('h1') else 'Untitled'
            filename = title.replace(' ', '_').lower() + '.md'
            filepath = os.path.join(save_dir, filename)
            content = soup.find('article')
            md_content = html_to_md(str(content))

            with open(filepath, 'w', encoding='utf-8') as file:
                file.write(md_content)

            results.append(
                {'url': post_url, 'message': f'Post saved to {filepath}'})
        except Exception as e:
            results.append({'url': post_url, 'error': str(e)})

    return jsonify(results)


def main():
    parser = argparse.ArgumentParser(
        description="Scrape Substack posts to Markdown")
    parser.add_argument("post_urls", nargs='+',
                        help="The URLs of the Substack posts to scrape")
    parser.add_argument("-d", "--directory", default=".",
                        help="Directory to save the scraped posts")
    args = parser.parse_args()

    if not os.path.exists(args.directory):
        os.makedirs(args.directory)

    for post_url in args.post_urls:
        scrape_post(post_url, args.directory)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3010)
