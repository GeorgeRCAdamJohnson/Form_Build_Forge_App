import os
import sqlite3

DB_PATH = os.path.join(os.path.dirname(__file__), 'forge_knowledge_base.db')

def remove_duplicates():
    with sqlite3.connect(DB_PATH) as conn:
        cur = conn.cursor()
        # Keep only the lowest id for each unique url
        cur.execute('''
            DELETE FROM resources
            WHERE id NOT IN (
                SELECT MIN(id) FROM resources GROUP BY url
            )
        ''')
        conn.commit()
        print("[INFO] Duplicate resources removed.")

if __name__ == '__main__':
    remove_duplicates()
