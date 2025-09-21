# TICKET-002: Module Not Found @forge/resolver

## Issue
`forge deploy` fails with error:
```
Bundling failed: Module not found: Error: Can't resolve '@forge/resolver' in 'C:\Users\biges\ForgeSciFiFormBuild3\formbuilder\src'
```

## Root Cause
Missing `@forge/resolver` dependency in package.json

## Resolution Steps
1. Add `@forge/resolver` to package.json dependencies
2. Run `npm install` to install the missing package
3. Retry `forge deploy`

## Code Fix
Add to package.json dependencies:
```json
"@forge/resolver": "^1.5.0"
```

## Prevention
- Include all required Forge dependencies in initial package.json
- Use Forge CLI to generate boilerplate with correct dependencies
- Check Forge documentation for required packages

## Status
✅ RESOLVED - Added @forge/resolver dependency and ran npm install