import os
import sqlite3

DB_PATH = os.path.join(os.path.dirname(__file__), 'forge_knowledge_base.db')

def print_resources():
    with sqlite3.connect(DB_PATH) as conn:
        cur = conn.cursor()
        cur.execute("SELECT id, type, title, url, description FROM resources ORDER BY id")
        rows = cur.fetchall()
        print("\n=== Forge Knowledge Base Resources ===\n")
        for row in rows:
            print(f"ID: {row[0]} | Type: {row[1]}\nTitle: {row[2]}\nURL: {row[3]}\nDescription: {row[4]}\n---")

if __name__ == '__main__':
    print_resources()
