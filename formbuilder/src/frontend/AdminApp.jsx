import React, { useState, useEffect } from 'react';
import FormBuilder from './FormBuilder';
import { invokeResolver } from './api';
import { ThemeProvider, useTheme } from './ThemeProvider';
import ThemeSelector from './ThemeSelector';

const AdminAppContent = () => {
  const [activeTab, setActiveTab] = useState('builder');
  const { theme, currentTheme } = useTheme();

  // Apply theme to body
  useEffect(() => {
    document.body.className = `theme-${currentTheme}`;
    document.body.style.background = theme.colors.background;
    document.body.style.color = theme.colors.text;
    document.body.style.fontFamily = theme.fonts.primary;
  }, [theme, currentTheme]);

  const renderContent = () => {
    switch(activeTab) {
      case 'builder':
        return <FormBuilder />;
      case 'browse':
        return <BrowseTemplates />;
      case 'view':
        return <ViewForm />;
      case 'readme':
        return <ReadMe />;
      default:
        return <FormBuilder />;
    }
  };

  return (
    <div>
      <ThemeSelector />
      <div className="admin-header">
        <div>
        <button 
          onClick={() => setActiveTab('builder')}
          className={activeTab === 'builder' ? 'tab-button tab-active' : 'tab-button tab-inactive'}
        >
          🛠️ NEURAL BUILDER
        </button>
        <button 
          onClick={() => setActiveTab('browse')}
          className={activeTab === 'browse' ? 'tab-button tab-active' : 'tab-button tab-inactive'}
        >
          📊 TEMPLATE MATRIX
        </button>
        <button 
          onClick={() => setActiveTab('view')}
          className={activeTab === 'view' ? 'tab-button tab-active' : 'tab-button tab-inactive'}
        >
          👁️ PREVIEW MODE
        </button>
        <button 
          onClick={() => setActiveTab('readme')}
          className={activeTab === 'readme' ? 'tab-button tab-active' : 'tab-button tab-inactive'}
        >
          📖 SYSTEM INFO
        </button>
        </div>
        <div className="version-display">
          [ v2.0.QUANTUM ]
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

const BrowseTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
    fetchProjects();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await invokeResolver('getTemplates');
      setTemplates(response.templates || []);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await invokeResolver('getProjects');
      setProjects(response.projects || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const filteredTemplates = selectedProjectFilter 
    ? templates.filter(t => t.projectId === selectedProjectFilter)
    : templates;

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const deleteTemplate = async (id) => {
    if (!confirm('Delete this template?')) return;
    try {
      await invokeResolver('deleteTemplate', { id });
      fetchTemplates();
    } catch (error) {
      alert('Failed to delete template');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading templates...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Browse Templates ({filteredTemplates.length})</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <select 
          value={selectedProjectFilter}
          onChange={(e) => setSelectedProjectFilter(e.target.value)}
          style={{ padding: '8px', width: '300px' }}
        >
          <option value="">All Projects ({templates.length} templates)</option>
          {projects.map(project => {
            const projectTemplateCount = templates.filter(t => t.projectId === project.id).length;
            return (
              <option key={project.id} value={project.id}>
                {project.name} ({projectTemplateCount} templates)
              </option>
            );
          })}
        </select>
      </div>
      
      {filteredTemplates.length === 0 ? (
        <p>{selectedProjectFilter ? 'No templates for this project.' : 'No templates saved yet. Create one in the Form Builder tab.'}</p>
      ) : (
        filteredTemplates.map(template => (
          <div key={template.id} style={{ 
            border: '1px solid #ccc', 
            padding: '15px', 
            margin: '10px 0',
            backgroundColor: '#f9f9f9'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#007acc' }}>{template.name}</h3>
            <p><strong>Project:</strong> {getProjectName(template.projectId)}</p>
            <p><strong>Fields:</strong> {template.fields.map(f => f.name).join(', ')}</p>
            <p style={{ fontSize: '12px', color: '#666' }}>Created: {new Date(template.created).toLocaleDateString()}</p>
            <button 
              onClick={() => deleteTemplate(template.id)}
              style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

const ViewForm = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await invokeResolver('getTemplates');
      setTemplates(response.templates || []);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const renderField = (field) => {
    const fieldStyle = {
      width: '100%', 
      padding: '10px', 
      border: '2px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px'
    };
    
    switch (field.type) {
      case 'string':
        return <input type="text" placeholder={`Enter ${field.friendlyName.toLowerCase()}`} style={fieldStyle} />;
      case 'user':
        return (
          <select style={fieldStyle}>
            <option>Select user...</option>
            <option>John Doe</option>
            <option>Jane Smith</option>
          </select>
        );
      case 'priority':
        return (
          <select style={fieldStyle}>
            <option>Select priority...</option>
            <option>🔴 High</option>
            <option>🟡 Medium</option>
            <option>🟢 Low</option>
          </select>
        );
      case 'array':
        return <input type="text" placeholder="Enter labels (comma separated)" style={fieldStyle} />;
      default:
        return <input type="text" placeholder={`Enter ${field.friendlyName.toLowerCase()}`} style={fieldStyle} />;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>View Form</h2>
      <div style={{ marginBottom: '20px' }}>
        <select 
          onChange={(e) => setSelectedTemplate(templates.find(t => t.id == e.target.value))}
          style={{ padding: '8px', width: '300px' }}
        >
          <option value="">Select template to preview...</option>
          {templates.map(template => (
            <option key={template.id} value={template.id}>{template.name}</option>
          ))}
        </select>
      </div>
      
      {selectedTemplate ? (
        <div style={{ 
          border: '2px solid #0052cc', 
          borderRadius: '8px',
          padding: '30px', 
          backgroundColor: 'white',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            borderBottom: '2px solid #f4f5f7', 
            paddingBottom: '15px', 
            marginBottom: '25px'
          }}>
            <h2 style={{ color: '#172b4d', margin: '0 0 5px 0' }}>Create Issue</h2>
            <p style={{ color: '#6b778c', margin: 0, fontSize: '14px' }}>Template: {selectedTemplate.name}</p>
          </div>
          
          <form>
            {selectedTemplate.fields.map(field => (
              <div key={field.id} style={{ marginBottom: '25px' }}>
                <label style={{ 
                  display: 'block', 
                  fontWeight: '600', 
                  marginBottom: '8px',
                  color: '#172b4d',
                  fontSize: '14px'
                }}>
                  {field.friendlyName || field.name}
                  {field.name === 'summary' && <span style={{ color: 'red' }}> *</span>}
                </label>
                {field.helpText && (
                  <p style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: '12px', 
                    color: '#6b778c',
                    fontStyle: 'italic'
                  }}>
                    📝 {field.helpText}
                  </p>
                )}
                {renderField(field)}
              </div>
            ))}
            
            <div style={{ 
              borderTop: '1px solid #f4f5f7', 
              paddingTop: '20px', 
              marginTop: '30px'
            }}>
              <button type="button" style={{ 
                padding: '12px 24px', 
                background: '#0052cc', 
                color: 'white', 
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                marginRight: '10px'
              }}>
                ✓ Create Issue
              </button>
              <button type="button" style={{ 
                padding: '12px 24px', 
                background: 'transparent', 
                color: '#6b778c', 
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <p>Select a template above to preview how it will look to users.</p>
      )}
    </div>
  );
};

const ReadMe = () => (
  <div style={{ padding: '20px' }}>
    <h2>Form Builder README</h2>
    <h3>Features</h3>
    <ul>
      <li>Select from available Jira fields</li>
      <li>Reorder fields with up/down buttons</li>
      <li>Save and load form templates</li>
      <li>Duplicate field validation</li>
    </ul>
  </div>
);

const AdminApp = () => {
  return (
    <ThemeProvider>
      <AdminAppContent />
    </ThemeProvider>
  );
};

export default AdminApp;