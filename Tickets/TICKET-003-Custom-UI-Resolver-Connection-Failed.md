# TICKET-003: Custom UI Resolver Connection Failed

## Issue
Frontend cannot communicate with backend resolvers in Custom UI setup. API calls fail and no data is loaded from Jira.

## Root Cause
Custom UI requires different API communication pattern than standard Forge UI Kit. Standard fetch() calls to `/resolver/` endpoints don't work.

## Symptoms
- Loading state never completes
- No Jira fields displayed
- Console errors for failed API calls
- UI functionality (add/remove fields) not working

## Attempted Solutions
1. ❌ `fetch('/resolver/getJiraFields')` - Standard REST approach
2. ❌ `window.AP.request()` - Connect app approach  
3. ✅ Mock data fallback - Temporary workaround

## Correct Solution (To Implement)
Custom UI needs proper resolver invocation method:
```javascript
// Need to research correct Custom UI resolver pattern
// Likely involves @forge/bridge or similar
```

## Prevention
- Research Custom UI communication patterns before implementation
- Create working resolver connection template
- Test resolver connectivity early in development
- Document correct Custom UI API patterns

## Status
✅ RESOLVED - @forge/bridge invoke method working, real Jira data loading

## Knowledge Base Update Needed
- Add Custom UI resolver communication patterns
- Document differences between UI Kit and Custom UI API calls
- Create working examples for future projects