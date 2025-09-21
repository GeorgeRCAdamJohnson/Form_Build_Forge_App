# TICKET-004: Form Builder Missing Core Features

## Issues
1. No duplicate field validation - same field can be added multiple times
2. No drag-and-drop reordering of selected fields
3. Save template functionality not working

## Root Cause
Basic UI implemented without validation logic or save functionality

## Resolution Steps
1. Add duplicate field checking before adding fields
2. Implement drag-and-drop reordering with hamburger menu
3. Connect save template to resolver with proper storage

## Status
🔄 IN PROGRESS - Implementing missing features