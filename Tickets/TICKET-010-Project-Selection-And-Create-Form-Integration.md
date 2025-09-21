# TICKET-010: Project Selection and Create Form Integration

## Requirements
1. **Project selection** - Users select which Jira project to apply form template to
2. **Replace create form** - Template should replace default Jira create issue form
3. **Project-specific templates** - Different templates for different projects

## Implementation Plan
1. Add project selection to template creation
2. Store project association with templates
3. Hook into Jira's create issue flow
4. Override default create form with custom template

## Technical Considerations
- Need `read:project:jira` permission
- May need issue creation hooks in manifest
- Template-to-project mapping in storage

## Status
🔄 PLANNING - Major feature requiring create issue integration