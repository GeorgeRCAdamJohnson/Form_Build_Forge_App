-- Insert official Atlassian Forge resources
INSERT INTO resources (type, title, url, description) VALUES
('tutorial', 'Getting Started with Forge', 'https://developer.atlassian.com/platform/forge/getting-started/', 'Official Atlassian Forge getting started guide.'),
('example', 'Forge Example Apps', 'https://developer.atlassian.com/platform/forge/example-apps/', 'Library of open source Forge example apps.'),
('doc', 'Forge Manifest Reference', 'https://developer.atlassian.com/platform/forge/manifest-reference/', 'Comprehensive manifest.yml reference.'),
('doc', 'Forge UI Kit Reference', 'https://developer.atlassian.com/platform/forge/ui-kit/', 'UI Kit and UI Kit 2 documentation.'),
('doc', 'Forge Storage API', 'https://developer.atlassian.com/platform/forge/storage/', 'Storage API usage and best practices.'),
('doc', 'Forge Security & Permissions', 'https://developer.atlassian.com/platform/forge/security/', 'Security, permissions, and tenancy isolation.'),
('community', 'Atlassian Developer Community', 'https://community.developer.atlassian.com/', 'Q&A, best practices, and code snippets.'),
('video', 'Atlassian Developer YouTube', 'https://www.youtube.com/@AtlassianDeveloper', 'Video walkthroughs and advanced topics.');

-- Insert best practices
INSERT INTO best_practices (title, details, resource_id) VALUES
('Use UI Kit 2 for new apps', 'UI Kit 2 provides better performance, flexibility, and modern components.', 4),
('Modularize resolver and UI logic', 'Separate resolver logic from UI for maintainability and testability.', 2),
('Leverage Forge Storage API', 'Use the Storage API for user, project, and global preferences. Avoid storing sensitive data in client-side code.', 5),
('Follow least-privilege permissions', 'Request only the permissions your app needs in manifest.yml.', 6),
('Use Atlassian Community for support', 'Search and ask questions in the Atlassian Developer Community for real-world solutions.', 7),
('Reference example apps for patterns', 'Study official and open-source example apps for advanced patterns and reusable code.', 2);

-- Insert patterns
INSERT INTO patterns (name, description, resource_id) VALUES
('Custom Field Management', 'Implement custom field discovery and creation using Jira REST API via Forge resolver.', 2),
('Theme Management', 'Build project branding and theme management UI, including color pickers and animated backgrounds.', 2),
('Form Builder', 'Set up form builder and template management (drag-and-drop UI, save/load templates).', 2),
('Global Admin Features', 'Implement global admin features for theme and template management.', 2),
('Preference Storage', 'Store user/project/global preferences using Forge Storage API.', 5);
