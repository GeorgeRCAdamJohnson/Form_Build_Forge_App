import sqlite3
import os

# Path to database
db_path = os.path.join(os.path.dirname(__file__), 'forge_knowledge_base.db')

# Read SQL file
with open('v3_lessons_simple.sql', 'r', encoding='utf-8') as f:
    sql_content = f.read()

# Execute SQL
try:
    with sqlite3.connect(db_path) as conn:
        # Split SQL into individual statements
        statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip()]
        
        for statement in statements:
            if statement:
                conn.execute(statement)
        
        conn.commit()
        print(f"✅ Successfully updated knowledge base with {len(statements)} statements")
        
        # Verify updates
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM lessons_learned WHERE category LIKE '%Enhanced%'")
        enhanced_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM implementation_details WHERE component_name LIKE '%Enhanced%'")
        impl_count = cursor.fetchone()[0]
        
        print(f"📊 Added {enhanced_count} enhanced lessons learned")
        print(f"📊 Added {impl_count} implementation details")
        
except Exception as e:
    print(f"Error updating database: {e}")