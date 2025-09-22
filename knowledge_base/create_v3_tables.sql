-- Create additional tables for V3 knowledge base
CREATE TABLE IF NOT EXISTS lessons_learned (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    lesson_title TEXT NOT NULL,
    description TEXT,
    what_worked TEXT,
    what_failed TEXT,
    solution TEXT,
    code_example TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS implementation_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    component_name TEXT NOT NULL,
    implementation_approach TEXT,
    key_patterns TEXT,
    performance_notes TEXT,
    maintenance_notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS performance_optimizations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    optimization_title TEXT NOT NULL,
    problem_description TEXT,
    solution_implemented TEXT,
    performance_impact TEXT,
    code_example TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS metadata (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Update existing best_practices table structure if needed
ALTER TABLE best_practices ADD COLUMN category TEXT;
ALTER TABLE best_practices ADD COLUMN practice_title TEXT;
ALTER TABLE best_practices ADD COLUMN implementation_example TEXT;
ALTER TABLE best_practices ADD COLUMN benefits TEXT;
ALTER TABLE best_practices ADD COLUMN created_at TEXT DEFAULT CURRENT_TIMESTAMP;