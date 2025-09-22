import React, { useState, useEffect } from 'react';
import { invokeResolver } from './api';
import { ThemeProvider, useTheme } from './ThemeProvider';
import ThemeSelector from './ThemeSelector';

const ProjectFormsContent = () => {
  const { theme, currentTheme } = useTheme();
  const [templates, setTemplates] = useState([]);

  // Apply theme to body
  useEffect(() => {
    document.body.className = `theme-${currentTheme}`;
    document.body.style.background = theme.colors.background;
    document.body.style.color = theme.colors.text;
    document.body.style.fontFamily = theme.fonts.primary;
  }, [theme, currentTheme]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentProject, setCurrentProject] = useState(null);

  useEffect(() => {
    fetchCurrentProject();
  }, []);
  
  useEffect(() => {
    if (currentProject) {
      fetchProjectTemplates();
    }
  }, [currentProject]);

  const fetchCurrentProject = async () => {
    try {
      // Get current project context from Jira
      const response = await invokeResolver('getCurrentProject');
      console.log('Project context response:', response);
      setCurrentProject(response.project);
    } catch (error) {
      console.error('Failed to get current project:', error);
      // Fallback for testing
      setCurrentProject({ id: '10001', name: 'Test Project' });
    }
  };

  const fetchProjectTemplates = async () => {
    try {
      const response = await invokeResolver('getTemplates');
      const allTemplates = response.templates || [];
      
      // Filter templates for current project
      const projectTemplates = currentProject 
        ? allTemplates.filter(t => t.projectId === currentProject.id)
        : allTemplates;
      
      console.log('All templates:', allTemplates.length);
      console.log('Project templates:', projectTemplates.length);
      console.log('Current project:', currentProject);
      
      setTemplates(projectTemplates);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (fieldId, value) => {
    setFormData({ ...formData, [fieldId]: value });
  };

  const shouldShowField = (field) => {
    // If no conditional logic, always show
    if (!field.conditionalField) return true;
    
    // Find the field this depends on
    const dependentField = selectedTemplate.fields.find(f => f.id === field.conditionalField);
    if (!dependentField) return true;
    
    const dependentValue = formData[dependentField.jiraId] || '';
    const conditionValue = field.conditionalValue || '';
    
    switch (field.conditionalOperator) {
      case 'equals':
        return dependentValue === conditionValue;
      case 'not_equals':
        return dependentValue !== conditionValue;
      case 'contains':
        return dependentValue.toLowerCase().includes(conditionValue.toLowerCase());
      case 'not_empty':
        return dependentValue.trim() !== '';
      case 'empty':
        return dependentValue.trim() === '';
      default:
        return true;
    }
  };

  const validateField = (field, value) => {
    if (!field.validationPattern || !value) return { valid: true };
    
    const patterns = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^[\+]?[1-9][\d]{0,15}$/,
      url: /^https?:\/\/.+/,
      number: /^\d+$/
    };
    
    let pattern;
    if (field.validationPattern === 'custom' && field.customPattern) {
      try {
        pattern = new RegExp(field.customPattern);
      } catch (e) {
        return { valid: false, message: 'Invalid custom pattern' };
      }
    } else {
      pattern = patterns[field.validationPattern];
    }
    
    if (pattern && !pattern.test(value)) {
      const messages = {
        email: 'Please enter a valid email address',
        phone: 'Please enter a valid phone number',
        url: 'Please enter a valid URL (starting with http:// or https://)',
        number: 'Please enter numbers only',
        custom: 'Value does not match required pattern'
      };
      return { valid: false, message: messages[field.validationPattern] || 'Invalid format' };
    }
    
    return { valid: true };
  };

  const validateForm = () => {
    const visibleFields = selectedTemplate.fields.filter(field => shouldShowField(field));
    const errors = [];
    
    for (const field of visibleFields) {
      const value = formData[field.jiraId] || '';
      
      // Check required fields
      if ((field.required || field.name === 'summary') && !value.trim()) {
        errors.push(`${field.friendlyName || field.name} is required`);
        continue;
      }
      
      // Check validation patterns
      const validation = validateField(field, value);
      if (!validation.valid) {
        errors.push(`${field.friendlyName || field.name}: ${validation.message}`);
      }
    }
    
    return errors;
  };

  const createIssue = async () => {
    if (!selectedTemplate) return;
    
    // Validate form before submission
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      alert('Please fix the following errors:\n\n' + validationErrors.join('\n'));
      return;
    }
    
    try {
      const response = await invokeResolver('createIssue', {
        projectId: currentProject?.id,
        templateId: selectedTemplate.id,
        fieldData: formData
      });
      
      if (response.success) {
        alert(`Issue created successfully! Key: ${response.issueKey}`);
        setFormData({});
        setSelectedTemplate(null);
      } else {
        console.error('Create issue error:', response.error);
        const errorMsg = typeof response.error === 'object' 
          ? JSON.stringify(response.error, null, 2)
          : response.error;
        alert('Failed to create issue: ' + errorMsg);
      }
    } catch (error) {
      console.error('Frontend createIssue error:', error);
      alert('Failed to create issue: ' + error.message);
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'string':
        return (
          <input 
            type="text" 
            placeholder={`🔋 ${field.friendlyName.toLowerCase()}`}
            value={formData[field.jiraId] || ''}
            onChange={(e) => handleFieldChange(field.jiraId, e.target.value)}
            className="form-field-input"
          />
        );
      case 'user':
        return (
          <select 
            value={formData[field.jiraId] || ''}
            onChange={(e) => handleFieldChange(field.jiraId, e.target.value)}
            className="form-field-input"
          >
            <option value="">👤 Select neural operator...</option>
            <option value="currentUser">🤖 Assign to me</option>
          </select>
        );
      case 'priority':
        return (
          <select 
            value={formData[field.jiraId] || ''}
            onChange={(e) => handleFieldChange(field.jiraId, e.target.value)}
            className="form-field-input"
          >
            <option value="">⚡ Select priority level...</option>
            <option value="1">🔴 CRITICAL</option>
            <option value="2">🟡 STANDARD</option>
            <option value="3">🟢 LOW</option>
          </select>
        );
      default:
        return (
          <input 
            type="text" 
            placeholder={`🔋 ${field.friendlyName.toLowerCase()}`}
            value={formData[field.jiraId] || ''}
            onChange={(e) => handleFieldChange(field.jiraId, e.target.value)}
            className="form-field-input"
          />
        );
    }
  };

  if (loading) return <div className="form-container">Loading...</div>;

  return (
    <div className="form-container">
      <ThemeSelector />
      <div className="project-header">
        <h1 className="project-title">
          {currentTheme === 'modern' ? '✨ ISSUE CREATOR' : currentTheme === 'barbie' ? '💖 BARBIE ISSUE CREATOR' : '⚡ QUANTUM ISSUE GENERATOR'}
        </h1>
        <div className="project-subtitle">
          [ PROJECT: {currentProject?.name || 'UNKNOWN'} ]
        </div>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <label className="field-label" style={{ display: 'block', marginBottom: '10px' }}>
          {currentTheme === 'modern' ? '📊 Select Template:' : currentTheme === 'barbie' ? '💖 Select Dream Template:' : '📊 Select Neural Template:'}
        </label>
        <select 
          value={selectedTemplate?.id || ''}
          onChange={(e) => {
            const template = templates.find(t => t.id == e.target.value);
            setSelectedTemplate(template);
            setFormData({});
          }}
          className="form-select"
          style={{ width: '400px' }}
        >
          <option value="">{currentTheme === 'modern' ? '📊 Choose a template...' : currentTheme === 'barbie' ? '💖 Choose your dream template...' : '🔍 Initialize template matrix...'}</option>
          {templates.map(template => (
            <option key={template.id} value={template.id}>{template.name}</option>
          ))}
        </select>
      </div>

      {selectedTemplate && (
        <div className="form-preview">
          <div className="form-title">
            <h2>{currentTheme === 'modern' ? '✨ CREATE ISSUE' : currentTheme === 'barbie' ? '💖 BARBIE DREAM MATRIX' : '⚡ QUANTUM ISSUE MATRIX'}</h2>
            <p className="form-subtitle">{currentTheme === 'barbie' ? '💖' : '🔋'} Template: {selectedTemplate.name}</p>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); createIssue(); }}>
            {selectedTemplate.fields
              .filter(field => shouldShowField(field))
              .map(field => (
              <div key={field.id} className="form-field">
                <label className="form-field-label">
                  🔹 {field.friendlyName || field.name}
                  {(field.required || field.name === 'summary') && <span style={{ color: '#ff0040' }}> ⚠</span>}
                  {field.conditionalField && (
                    <span style={{ color: '#ff6600', fontSize: '12px', fontStyle: 'italic' }}>
                      {' '}[CONDITIONAL]
                    </span>
                  )}
                </label>
                {field.helpText && (
                  <p className="form-field-help">
                    📊 {field.helpText}
                  </p>
                )}
                {renderField(field)}
              </div>
            ))}
            
            <div className="form-actions">
              <button type="submit" className="btn-create">
                {currentTheme === 'modern' ? '✨ CREATE ISSUE' : currentTheme === 'barbie' ? '💖 CREATE DREAM ISSUE' : '🚀 DEPLOY ISSUE'}
              </button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => {
                  setSelectedTemplate(null);
                  setFormData({});
                }}
              >
                {currentTheme === 'modern' ? 'Cancel' : currentTheme === 'barbie' ? '💖 CANCEL' : '❌ ABORT'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const ProjectForms = () => {
  return (
    <ThemeProvider>
      <ProjectFormsContent />
    </ThemeProvider>
  );
};

export default ProjectForms;