import sqlite3
import os

# Path to database
db_path = os.path.join(os.path.dirname(__file__), 'forge_knowledge_base.db')

# Create tables first
with open('create_v3_tables.sql', 'r', encoding='utf-8') as f:
    schema_sql = f.read()

# Insert data
with open('v3_lessons_simple.sql', 'r', encoding='utf-8') as f:
    data_sql = f.read()

try:
    with sqlite3.connect(db_path) as conn:
        # Create tables (ignore errors for existing columns)
        schema_statements = [stmt.strip() for stmt in schema_sql.split(';') if stmt.strip()]
        for statement in schema_statements:
            if statement:
                try:
                    conn.execute(statement)
                except sqlite3.OperationalError as e:
                    if 'duplicate column name' not in str(e).lower():
                        print(f"Schema warning: {e}")
        
        # Insert data
        data_statements = [stmt.strip() for stmt in data_sql.split(';') if stmt.strip()]
        for statement in data_statements:
            if statement:
                conn.execute(statement)
        
        conn.commit()
        print(f"Successfully updated knowledge base with {len(data_statements)} data statements")
        
        # Verify updates
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM lessons_learned")
        lessons_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM implementation_details")
        impl_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM performance_optimizations")
        perf_count = cursor.fetchone()[0]
        
        print(f"Database contains:")
        print(f"  - {lessons_count} lessons learned")
        print(f"  - {impl_count} implementation details") 
        print(f"  - {perf_count} performance optimizations")
        
except Exception as e:
    print(f"Error updating database: {e}")