# Insert or update a resource in the database
def upsert_resource(cur, r):
    # De-dupe by URL: insert if not exists, else update
    cur.execute("SELECT id FROM resources WHERE url = ?", (r['url'],))
    row = cur.fetchone()
    if row:
        cur.execute("UPDATE resources SET type=?, title=?, description=? WHERE url=?", (r['type'], r['title'], r['description'], r['url']))
    else:
        cur.execute("INSERT INTO resources (type, title, url, description) VALUES (?, ?, ?, ?)", (r['type'], r['title'], r['url'], r['description']))
import os
import sys
import sqlite3
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import re
from urllib.parse import urljoin, urlparse

# Path to your SQLite DB
DB_PATH = os.path.join(os.path.dirname(__file__), 'forge_knowledge_base.db')


# --- Crawler for all /platform/forge/ subpages ---
def crawl_forge_docs(base_url):
    visited = set()
    to_visit = [base_url]
    discovered = []
    while to_visit:
        url = to_visit.pop()
        if url in visited:
            continue
        visited.add(url)
        try:
            resp = requests.get(url, timeout=10)
            soup = BeautifulSoup(resp.text, 'html.parser')
            # Get title
            title = soup.title.string.strip() if soup.title else url
            discovered.append({
                'type': 'doc',
                'title': title,
                'url': url,
                'desc_selector': 'meta[name="description"]',
            })
            # Find all internal links
            for a in soup.find_all('a', href=True):
                href = a['href']
                abs_url = urljoin(url, href)
                parsed = urlparse(abs_url)
                if (
                    abs_url.startswith(base_url)
                    and '#' not in abs_url
                    and parsed.scheme in ('http', 'https')
                    and abs_url not in visited
                    and abs_url not in to_visit
                ):
                    to_visit.append(abs_url)
        except Exception as e:
            print(f"[WARN] Failed to crawl {url}: {e}")
    return discovered

def get_description(url, selector):
    try:
        resp = requests.get(url, timeout=10)
        soup = BeautifulSoup(resp.text, 'html.parser')
        tag = soup.select_one(selector)
        if tag:
            return tag.get('content', '').strip()
    except Exception as e:
        print(f"Error fetching {url}: {e}")

def extract_prompts(soup):
    # Example: look for <h2> or <h3> with 'FAQ', 'Prompt', 'How to', etc.
    prompts = []
    for h in soup.find_all(['h2', 'h3']):
        if any(x in h.get_text().lower() for x in ['faq', 'prompt', 'how do', 'how to', 'example']):
            # Get next sibling paragraph or list
            sib = h.find_next_sibling(['p', 'ul', 'ol'])
            if sib:
                prompts.append({'prompt_text': h.get_text().strip(), 'answer_template': sib.get_text().strip()})
    return prompts

def upsert_snippet(cur, resource_id, snippet):
    # De-dupe by code and resource
    cur.execute("SELECT id FROM snippets WHERE resource_id=? AND code=?", (resource_id, snippet['code']))
    if not cur.fetchone():
        cur.execute("INSERT INTO snippets (resource_id, language, code, context) VALUES (?, ?, ?, ?)",
                    (resource_id, snippet['language'], snippet['code'], ''))

def upsert_prompt(cur, resource_id, prompt):
    # De-dupe by prompt text and resource
    cur.execute("SELECT id FROM prompts WHERE resource_id=? AND prompt_text=?", (resource_id, prompt['prompt_text']))
    if not cur.fetchone():
        cur.execute("INSERT INTO prompts (resource_id, prompt_text, answer_template) VALUES (?, ?, ?)",
                    (resource_id, prompt['prompt_text'], prompt['answer_template']))

def main():
    if not os.path.exists(DB_PATH):
        init_db()
    base_url = 'https://developer.atlassian.com/platform/forge/'
    print('[INFO] Crawling Forge docs...')
    resources = crawl_forge_docs(base_url)
    print(f'[INFO] Discovered {len(resources)} Forge doc pages.')
    with sqlite3.connect(DB_PATH) as conn:
        cur = conn.cursor()
        total = len(resources)
        for i, r in enumerate(resources):
            print(f"[{i+1}/{total}] Processing: {r['url']}")
            desc = get_description(r['url'], r['desc_selector'])
            r['description'] = desc or f"{r['title']} (no description found)"
            upsert_resource(cur, r)
            # Get resource_id
            cur.execute("SELECT id FROM resources WHERE url=?", (r['url'],))
            resource_id = cur.fetchone()[0]
            # Scrape page for code snippets and prompts
            try:
                resp = requests.get(r['url'], timeout=10)
                soup = BeautifulSoup(resp.text, 'html.parser')
                # Extract and store code snippets (skip UI Kit 1)
                for snippet in extract_code_snippets(soup):
                    upsert_snippet(cur, resource_id, snippet)
                # Extract and store prompts
                for prompt in extract_prompts(soup):
                    upsert_prompt(cur, resource_id, prompt)
            except Exception as e:
                print(f"Error scraping {r['url']} for snippets/prompts: {e}")
        conn.commit()
    print(f"[INFO] Forge knowledge base updated at {datetime.now()}")

if __name__ == '__main__':
    main()
