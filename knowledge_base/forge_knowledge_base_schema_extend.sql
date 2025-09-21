-- Add new tables for code snippets and prompts
CREATE TABLE IF NOT EXISTS snippets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resource_id INTEGER,
    language TEXT,
    code TEXT,
    context TEXT,
    FOREIGN KEY(resource_id) REFERENCES resources(id)
);

CREATE TABLE IF NOT EXISTS prompts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resource_id INTEGER,
    prompt_text TEXT,
    answer_template TEXT,
    FOREIGN KEY(resource_id) REFERENCES resources(id)
);
