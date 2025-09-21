# Forge App Templates for Admin Team

## Quick Start Templates

### Template 1: Basic CRUD App
**Use Case**: Simple data management with list/create/edit/delete
**Time to Deploy**: 30 minutes

```bash
# Setup
forge create --template basic-crud
cd basic-crud-app
npm install
forge deploy
```

**Features**:
- ✅ Data listing with pagination
- ✅ Create/Edit forms
- ✅ Delete confirmation
- ✅ Search and filtering
- ✅ Storage integration

### Template 2: Settings Manager
**Use Case**: Configuration interfaces for projects/global settings
**Time to Deploy**: 20 minutes

```bash
forge create --template settings-manager
```

**Features**:
- ✅ Project-level settings
- ✅ Global admin settings  
- ✅ Form validation
- ✅ Save/reset functionality
- ✅ Permission handling

### Template 3: Dashboard App
**Use Case**: Data visualization and metrics (within Forge limits)
**Time to Deploy**: 45 minutes

```bash
forge create --template dashboard
```

**Features**:
- ✅ Statistics cards
- ✅ Data tables
- ✅ Basic charts (text-based)
- ✅ Refresh functionality
- ✅ Export capabilities

### Template 4: Form Builder
**Use Case**: Dynamic form creation and management
**Time to Deploy**: 60 minutes

```bash
forge create --template form-builder
```

**Features**:
- ✅ Drag-and-drop form builder
- ✅ Field type selection
- ✅ Form validation rules
- ✅ Response collection
- ✅ Export responses

### Template 5: Integration Hub
**Use Case**: External API connections and data sync
**Time to Deploy**: 90 minutes

```bash
forge create --template integration-hub
```

**Features**:
- ✅ API configuration
- ✅ Data mapping
- ✅ Sync scheduling
- ✅ Error handling
- ✅ Audit logging

## Template Structure

### Standard File Organization
```
forge-app-template/
├── manifest.yml              # App configuration
├── package.json              # Dependencies
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── BaseLayout.jsx   # Standard app layout
│   │   ├── DataTable.jsx    # Table with pagination
│   │   ├── FormBuilder.jsx  # Dynamic form creation
│   │   ├── SettingsForm.jsx # Configuration forms
│   │   └── StatusCard.jsx   # Metrics display
│   ├── pages/               # Full page components
│   │   ├── Dashboard.jsx    # Main dashboard
│   │   ├── Settings.jsx     # Admin settings
│   │   └── ListView.jsx     # Data listing
│   ├── resolvers/           # Backend logic
│   │   ├── index.js        # Main resolver
│   │   ├── storage.js      # Data operations
│   │   └── api.js          # External API calls
│   ├── hooks/              # Custom React hooks
│   │   ├── useForgeStorage.js # Storage abstraction
│   │   ├── useApi.js       # API integration
│   │   └── usePermissions.js # Permission checking
│   └── utils/              # Helper functions
│       ├── validation.js   # Form validation
│       ├── formatting.js   # Data formatting
│       └── constants.js    # App constants
├── static/                 # Static assets
└── README.md              # Setup instructions
```

### Standard Components Library

#### BaseLayout.jsx
```jsx
import React from 'react';
import { Box, Heading } from '@forge/react';

export const BaseLayout = ({ title, children, actions }) => (
  <Box>
    <Box>
      <Heading size="large">{title}</Heading>
      {actions && <Box>{actions}</Box>}
    </Box>
    <Box>{children}</Box>
  </Box>
);
```

#### DataTable.jsx
```jsx
import React from 'react';
import { Box, Text, Button } from '@forge/react';

export const DataTable = ({ data, columns, onEdit, onDelete }) => (
  <Box>
    {data.map((row, i) => (
      <Box key={i}>
        {columns.map(col => (
          <Text key={col.key}>{row[col.key]}</Text>
        ))}
        <Button text="Edit" onClick={() => onEdit(row)} />
        <Button text="Delete" onClick={() => onDelete(row)} />
      </Box>
    ))}
  </Box>
);
```

#### useForgeStorage.js
```jsx
import { useState, useEffect } from 'react';
import { invoke } from '@forge/bridge';

export const useForgeStorage = (key, scope = 'app') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await invoke('getStorage', { key, scope });
        setData(result);
      } catch (error) {
        console.error('Storage load error:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [key, scope]);

  const saveData = async (newData) => {
    try {
      await invoke('setStorage', { key, value: newData, scope });
      setData(newData);
    } catch (error) {
      console.error('Storage save error:', error);
    }
  };

  return [data, saveData, loading];
};
```

## Deployment Checklist

### Pre-Deployment
- [ ] Update app name in manifest.yml
- [ ] Configure required permissions
- [ ] Set environment variables
- [ ] Test all functionality locally
- [ ] Review security implications

### Deployment Steps
```bash
# 1. Build and validate
forge build
forge lint

# 2. Deploy to development
forge deploy --environment development

# 3. Test in development environment
forge install --site your-dev-site

# 4. Deploy to production
forge deploy --environment production

# 5. Install in production
forge install --site your-prod-site
```

### Post-Deployment
- [ ] Verify all features work
- [ ] Test permissions and access
- [ ] Monitor error logs
- [ ] Document for end users
- [ ] Train admin team

## Common Patterns

### Error Handling
```jsx
const [error, setError] = useState(null);

try {
  const result = await invoke('apiCall', data);
  setError(null);
} catch (err) {
  setError(err.message);
}

{error && <Text>Error: {error}</Text>}
```

### Loading States
```jsx
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    await invoke('saveData', formData);
  } finally {
    setLoading(false);
  }
};

<Button text="Save" onClick={handleSubmit} isDisabled={loading} />
```

### Form Validation
```jsx
const [errors, setErrors] = useState({});

const validate = (data) => {
  const newErrors = {};
  if (!data.name) newErrors.name = 'Name is required';
  if (!data.email) newErrors.email = 'Email is required';
  return newErrors;
};

const handleSubmit = () => {
  const validationErrors = validate(formData);
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
  // Submit form
};
```

## Best Practices

### Performance
- Use React.memo for expensive components
- Implement proper loading states
- Minimize resolver calls
- Cache frequently accessed data

### Security
- Validate all inputs
- Use proper permission scopes
- Sanitize user data
- Follow Forge security guidelines

### User Experience
- Provide clear feedback
- Use consistent styling
- Implement proper error handling
- Add helpful tooltips and guidance

### Maintenance
- Document all customizations
- Use semantic versioning
- Monitor deprecation warnings
- Keep dependencies updated

## Template Customization Guide

### 1. Branding (Within Limits)
```jsx
// Use emojis and text for visual identity
const AppHeader = () => (
  <Heading size="large">🚀 Your App Name</Heading>
);

// Consistent terminology
const LABELS = {
  create: 'Add New Item',
  edit: 'Modify Item', 
  delete: 'Remove Item'
};
```

### 2. Functionality Extensions
```jsx
// Add custom business logic
const useBusinessLogic = () => {
  // Your specific logic here
  return { processData, validateRules };
};

// Extend base components
const CustomDataTable = (props) => (
  <DataTable 
    {...props}
    onRowClick={handleCustomAction}
    extraColumns={customColumns}
  />
);
```

### 3. Integration Points
```jsx
// External API integration
resolver.define('syncExternalData', async ({ payload }) => {
  const response = await fetch(externalAPI, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return response.json();
});
```

This template system allows your admin team to rapidly deploy functional Forge apps while working within the platform's constraints. Each template provides a solid foundation that can be customized for specific business needs without starting from scratch.