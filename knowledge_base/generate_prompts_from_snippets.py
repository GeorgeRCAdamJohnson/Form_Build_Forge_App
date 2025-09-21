import os
import sqlite3

DB_PATH = os.path.join(os.path.dirname(__file__), 'forge_knowledge_base.db')

# Example prompt templates for common Forge tasks
PROMPT_TEMPLATES = [
    {
        'prompt_text': 'How do I set up my environment for Forge app development?',
        'snippet_keywords': ['nvm install', 'npm install -g @forge/cli', 'forge --version'],
        'answer_intro': 'To set up your Forge development environment, follow these steps:'
    },
    {
        'prompt_text': 'How do I configure my Forge app manifest?',
        'snippet_keywords': ['app:', 'manifest', 'licensing:', 'remotes:'],
        'answer_intro': 'Here is an example Forge manifest configuration:'
    },
    {
        'prompt_text': 'How do I read a file in a Forge app?',
        'snippet_keywords': ['readFileSync', 'node:fs'],
        'answer_intro': 'You can read a file in your Forge app using:'
    },
    {
        'prompt_text': 'How do I execute a command in a Forge app?',
        'snippet_keywords': ['execFileSync', 'node:child_process'],
        'answer_intro': 'To execute a command in your Forge app, use:'
    },
]

def find_snippet(cur, keywords):
    for kw in keywords:
        cur.execute("SELECT code FROM snippets WHERE code LIKE ? LIMIT 1", (f'%{kw}%',))
        row = cur.fetchone()
        if row:
            return row[0]
    return None

def seed_prompts():
    with sqlite3.connect(DB_PATH) as conn:
        cur = conn.cursor()
        for template in PROMPT_TEMPLATES:
            code = find_snippet(cur, template['snippet_keywords'])
            if code:
                answer = f"{template['answer_intro']}\n\n{code}"
                # Use the first resource that matches the snippet
                cur.execute("SELECT resource_id FROM snippets WHERE code=? LIMIT 1", (code,))
                resource_row = cur.fetchone()
                resource_id = resource_row[0] if resource_row else None
                # De-dupe
                cur.execute("SELECT id FROM prompts WHERE prompt_text=?", (template['prompt_text'],))
                if not cur.fetchone():
                    cur.execute("INSERT INTO prompts (resource_id, prompt_text, answer_template) VALUES (?, ?, ?)",
                                (resource_id, template['prompt_text'], answer))
        conn.commit()
    print('[INFO] Prompts generated and seeded from database snippets.')

if __name__ == '__main__':
    seed_prompts()
