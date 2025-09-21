# TICKET-012: Tunnel Development Process Documentation

## Issue
Tunnel requirement for Custom UI development not clearly documented

## Root Cause
Custom UI apps require `forge tunnel` running in separate terminal for resolver connectivity during development

## Development Process
1. **Terminal 1**: Run `forge tunnel` (keep running)
2. **Terminal 2**: Make code changes, run `npm run build` as needed
3. Tunnel automatically picks up rebuilt changes
4. No need to redeploy during development

## Key Points
- Tunnel must be running for resolver bridge to work
- Changes are live-reloaded through tunnel
- Only deploy (`forge deploy`) for production releases

## Status
✅ RESOLVED - Process documented for future reference