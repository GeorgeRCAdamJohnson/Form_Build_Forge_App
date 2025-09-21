# Forge Form Builder - Rebuild Checklist

## Phase 1: Project Setup
- [x] Create new Forge app with Custom UI
- [x] Set up project structure with frontend/resolvers separation
- [x] Configure manifest.yml for Custom UI modules
- [x] Install dependencies (React, TypeScript, Forge APIs)
- [x] Test basic deployment and installation

## Phase 2: Core Form Builder ✅ COMPLETE
- [x] Create FormBuilder React component
- [x] Implement field selection UI
- [x] Add drag-and-drop field arrangement
- [x] Build template save functionality
- [x] Build template load functionality
- [x] Add form validation (prevent empty saves, duplicate names)

## Phase 3: Jira Integration & Polish ✅ COMPLETE
- [x] Create kickass custom icon
- [x] Create resolver for Jira field discovery
- [x] Implement Forge Storage for templates
- [x] Add project selection functionality
- [x] Fix Custom UI resolver connection (TICKET-003) - Tunnel required
- [x] Test and verify all integrations with real data
- [x] Project-specific form integration
- [x] Issue creation with proper formatting

## POST-PRODUCTION Backlog
- [ ] Create button integration (TICKET-011)
- [ ] Issue panel module integration
- [ ] Advanced form validation

## Phase 4: Enhanced Form Builder Features ✅ IN PROGRESS
- [x] Conditional Logic (Dynamic Fields) - Show/hide fields based on user input
- [x] Field Validation - Email, phone, URL, number, custom regex patterns
- [x] Required Field Support - Mark fields as required with visual indicators
- [x] Drag-and-Drop Field Reordering - Modern UX with @dnd-kit
- [ ] Rich Text Editor for description fields
- [ ] File Upload Support
- [ ] Multi-select and checkbox groups
- [ ] Date/Time pickers with validation

## Phase 5: Admin Interface
- [ ] Create admin page module
- [ ] Build template management UI
- [ ] Add template delete functionality
- [ ] Implement bulk operations

## Phase 6: Advanced Features (Future)
- [ ] External User Access (Portal Mode)
- [ ] Form Analytics and Reporting
- [ ] Automation Hooks and Triggers
- [ ] Integration with Jira Workflows
- [ ] Custom Form Templates per Request Type
- [ ] Bulk Issue Creation
- [ ] Form Versioning and History

## Phase 7: Polish & Deploy
- [ ] Add error handling and user feedback
- [ ] Test all functionality
- [ ] Document usage and setup
- [ ] Deploy to production environment

## Key Principles
- Use Custom UI only (no UI Kit)
- Focus on functionality over visuals
- Implement proper error handling from start
- Document all limitations and workarounds
- Keep code modular and maintainable