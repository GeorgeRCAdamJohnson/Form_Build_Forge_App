# TICKET-009: Custom Fields Not Loading from Jira

## Issue
Custom fields from the Jira instance are not appearing in the available fields list

## Root Cause
1. Resolver connection still using fallback mock data
2. Custom UI bridge not properly connecting to backend
3. May need additional Jira permissions for custom fields

## Investigation Steps
1. Check if resolver is actually being called
2. Verify Jira API permissions in manifest
3. Test resolver connection with browser dev tools

## Status
🔍 INVESTIGATING - Need to verify resolver connectivity