import React, { useState, useEffect } from 'react';
import { invokeResolver } from './api';
import { useTheme } from './ThemeProvider';

const CreateButtonModal = ({ isOpen, onClose, projectId }) => {
  const { theme, currentTheme } = useTheme();
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && projectId) {
      fetchTemplates();
    }
  }, [isOpen, projectId]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await invokeResolver('getTemplates');
      const projectTemplates = response.templates?.filter(t => t.projectId === projectId) || [];
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

  const createIssue = async () => {
    if (!selectedTemplate) return;
    
    try {
      setLoading(true);
      const response = await invokeResolver('createIssue', {
        projectId,
        templateId: selectedTemplate.id,
        fieldData: formData
      });
      
      if (response.success) {
        alert(`Issue created successfully! Key: ${response.issueKey}`);
        onClose();
        setFormData({});
        setSelectedTemplate(null);
      } else {
        alert('Failed to create issue: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Failed to create issue: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'string':
        return (
          <input 
            type="text" 
            placeholder={field.friendlyName || field.name}
            value={formData[field.jiraId] || ''}
            onChange={(e) => handleFieldChange(field.jiraId, e.target.value)}
            className="modal-field-input"
          />
        );
      case 'textarea':
        return (
          <textarea 
            placeholder={field.friendlyName || field.name}
            rows={3}
            value={formData[field.jiraId] || ''}
            onChange={(e) => handleFieldChange(field.jiraId, e.target.value)}
            className="modal-field-input"
          />
        );
      case 'select':
        return (
          <select 
            value={formData[field.jiraId] || ''}
            onChange={(e) => handleFieldChange(field.jiraId, e.target.value)}
            className="modal-field-input"
          >
            <option value="">Select {field.friendlyName || field.name}...</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        );
      default:
        return (
          <input 
            type="text" 
            placeholder={field.friendlyName || field.name}
            value={formData[field.jiraId] || ''}
            onChange={(e) => handleFieldChange(field.jiraId, e.target.value)}
            className="modal-field-input"
          />
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">
            {currentTheme === 'modern' ? '✨ Quick Create' : 
             currentTheme === 'barbie' ? '💖 Dream Creator' : 
             '⚡ Quantum Generator'}
          </h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          {loading ? (
            <div className="modal-loading">Loading templates...</div>
          ) : templates.length === 0 ? (
            <div className="modal-empty">
              <p>No form templates available for this project.</p>
              <p>Create templates in the Form Builder admin panel.</p>
            </div>
          ) : !selectedTemplate ? (
            <div className="template-selector">
              <h3>Select a Template:</h3>
              <div className="template-grid">
                {templates.map(template => (
                  <div 
                    key={template.id} 
                    className="template-card"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="template-name">{template.name}</div>
                    <div className="template-fields">
                      {template.fields?.length || 0} fields
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="form-container">
              <div className="form-header">
                <h3>{selectedTemplate.name}</h3>
                <button 
                  className="btn-back"
                  onClick={() => setSelectedTemplate(null)}
                >
                  ← Back to Templates
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); createIssue(); }}>
                {selectedTemplate.fields?.map(field => (
                  <div key={field.id} className="modal-field">
                    <label className="modal-field-label">
                      {field.friendlyName || field.name}
                      {(field.required || field.name === 'summary') && 
                        <span className="required-indicator"> *</span>
                      }
                    </label>
                    {field.helpText && (
                      <div className="modal-field-help">{field.helpText}</div>
                    )}
                    {renderField(field)}
                  </div>
                ))}
                
                <div className="modal-actions">
                  <button type="submit" className="btn-create" disabled={loading}>
                    {loading ? 'Creating...' : 
                     currentTheme === 'modern' ? '✨ Create Issue' :
                     currentTheme === 'barbie' ? '💖 Create Dream' :
                     '🚀 Deploy Issue'}
                  </button>
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={() => setSelectedTemplate(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateButtonModal;