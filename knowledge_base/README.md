# Forge Knowledge Base Scripts Mapping

This document explains the purpose and usage of each script in the `knowledge_base` directory. Use this as a reference for maintaining and updating the knowledge base in the future.

## Scripts Overview

- **generate_prompts_from_snippets.py**
  - Seeds example prompt templates into the database by searching for relevant code snippets.
  - Usage: Run to add or update prompt templates based on code snippets in the DB.

- **insert_forge_ui_kit_docs.py**
  - Inserts official Forge UI Kit documentation and best practices as resources into the database.
  - Usage: Run to add or update UI Kit docs and related code snippets.

- **print_forge_knowledge_base.py**
  - Prints all resources in the knowledge base.
  - Usage: Run to view a summary of all resources.

- **print_forge_knowledge_details.py**
  - Prints all code snippets and prompts, grouped by resource.
  - Usage: Run to view detailed code snippets and prompts.

- **remove_resource_duplicates.py**
  - Removes duplicate resources from the database, keeping only the lowest ID for each unique URL.
  - Usage: Run to clean up duplicate entries in the resources table.

- **update_forge_knowledge_base.py**
  - Crawls Atlassian Forge documentation, updates resources, and scrapes code snippets and prompts.
  - Usage: Run to update the knowledge base with the latest docs, code, and prompts.

## Database Files

- **forge_knowledge_base.db**: SQLite database file storing all resources, snippets, and prompts.
- **forge_knowledge_base_schema.sql**: SQL schema for initializing the database.
- **forge_knowledge_base_schema_extend.sql**: Additional schema changes or extensions.
- **forge_knowledge_base_inserts.sql**: Example or seed data for the database.

## Maintenance Tips

- Always back up `forge_knowledge_base.db` before running update or cleanup scripts.
- Run `update_forge_knowledge_base.py` regularly to keep the knowledge base current.
- Use the print scripts to verify the state of the database after updates.
- Review and update this mapping as scripts or database structure change.
