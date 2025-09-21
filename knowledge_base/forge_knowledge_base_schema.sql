-- Forge Knowledge Base SQLite Schema
-- This schema is designed for storing best practices, patterns, and resource links for Forge development.

CREATE TABLE IF NOT EXISTS resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL, -- e.g., 'tutorial', 'example', 'repo', 'blog', 'video', 'doc'
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS patterns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    resource_id INTEGER,
    FOREIGN KEY(resource_id) REFERENCES resources(id)
);

CREATE TABLE IF NOT EXISTS best_practices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    details TEXT,
    resource_id INTEGER,
    FOREIGN KEY(resource_id) REFERENCES resources(id)
);

-- Example insert (for reference):
-- INSERT INTO resources (type, title, url, description) VALUES ('tutorial', 'Getting Started with Forge', 'https://developer.atlassian.com/platform/forge/getting-started/', 'Official Atlassian Forge getting started guide.');
-- INSERT INTO patterns (name, description, resource_id) VALUES ('Modular Resolver Pattern', 'Separate resolver logic for maintainability.', 1);
-- INSERT INTO best_practices (title, details, resource_id) VALUES ('Use UI Kit 2 for new apps', 'UI Kit 2 provides better performance and flexibility.', 1);
