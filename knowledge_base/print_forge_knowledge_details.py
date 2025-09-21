import os
import sqlite3

DB_PATH = os.path.join(os.path.dirname(__file__), 'forge_knowledge_base.db')

def print_snippets():
    with sqlite3.connect(DB_PATH) as conn:
        cur = conn.cursor()
        cur.execute("SELECT s.id, r.title, s.language, s.code FROM snippets s JOIN resources r ON s.resource_id = r.id ORDER BY s.id")
        rows = cur.fetchall()
        print("\n=== Forge Knowledge Base Code Snippets ===\n")
        for row in rows:
            print(f"ID: {row[0]} | Resource: {row[1]} | Language: {row[2]}\nCode:\n{row[3]}\n---")

def print_prompts():
    with sqlite3.connect(DB_PATH) as conn:
        cur = conn.cursor()
        cur.execute("SELECT p.id, r.title, p.prompt_text, p.answer_template FROM prompts p JOIN resources r ON p.resource_id = r.id ORDER BY p.id")
        rows = cur.fetchall()
        print("\n=== Forge Knowledge Base Prompts ===\n")
        for row in rows:
            print(f"ID: {row[0]} | Resource: {row[1]}\nPrompt: {row[2]}\nAnswer Template: {row[3]}\n---")

if __name__ == '__main__':
    print_snippets()
    print_prompts()
