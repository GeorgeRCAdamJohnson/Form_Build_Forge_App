# TICKET-001: Manifest Missing Icon

## Issue
`forge deploy` fails with error:
```
jira:issuePanel required properties are 'function, icon, title, key' or 'icon, resource, title, key'
```

## Root Cause
Forge manifest requires `icon` property for all UI modules (issuePanel, adminPage, etc.)

## Resolution Steps
1. Add `icon` property to each module in `manifest.yml`
2. Use placeholder icons or Atlassian default icons

## Code Fix
```yaml
jira:issuePanel:
  - key: formbuilder-panel
    resource: main
    resolver:
      function: resolver
    title: Form Builder
    icon: https://developer.atlassian.com/platform/forge/images/icons/issue-panel-icon.svg
```

## Prevention
- Always include `icon` property in manifest modules
- Use manifest template with required properties
- Run `forge lint` before deploy

## Status
✅ RESOLVED - Icons added to manifest.yml