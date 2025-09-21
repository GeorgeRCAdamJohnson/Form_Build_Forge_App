# TICKET-006: Admin Page Module Limitations

## Issue
Cannot create multiple admin page modules. Forge only allows single admin page entry.

## Error Messages
- "The jira:adminPage module can only have a single entry"
- "Custom UI resource must be a directory" for HTML files

## Root Cause
Forge admin pages work differently than expected - only one admin page allowed per app

## Resolution
Use single admin page with internal navigation/tabs instead of multiple admin pages

## Status
🔄 IN PROGRESS - Need to redesign as single page with tabs