import React, { useState, useEffect } from 'react';
import { invokeResolver } from './api';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableField = ({ field, updateFieldProperty, removeField, selectedFields }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div style={{ 
        padding: '15px', 
        border: '1px solid #007acc', 
        margin: '10px 0',
        backgroundColor: '#e6f3ff',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              {...listeners} 
              style={{ 
                cursor: 'grab', 
                padding: '5px',
                backgroundColor: '#ddd',
                borderRadius: '3px',
                userSelect: 'none'
              }}
              title="Drag to reorder"
            >
              ⋮⋮
            </div>
            <div>
              <strong>{field.name}</strong> <small>({field.type})</small>
            </div>
          </div>
          <button 
            onClick={() => removeField(field.id)} 
            style={{ 
              background: 'red', 
              color: 'white', 
              border: 'none', 
              padding: '5px 10px', 
              cursor: 'pointer',
              borderRadius: '3px'
            }}
          >
            Remove
          </button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Friendly Name:</label>
            <input 
              type="text" 
              value={field.friendlyName}
              onChange={(e) => updateFieldProperty(field.id, 'friendlyName', e.target.value)}
              style={{ width: '100%', padding: '5px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Help Text:</label>
            <input 
              type="text" 
              value={field.helpText}
              onChange={(e) => updateFieldProperty(field.id, 'helpText', e.target.value)}
              placeholder="Optional help text..."
              style={{ width: '100%', padding: '5px' }}
            />
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Required:</label>
            <input 
              type="checkbox" 
              checked={field.required || false}
              onChange={(e) => updateFieldProperty(field.id, 'required', e.target.checked)}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Validation Pattern:</label>
            <select 
              value={field.validationPattern || ''}
              onChange={(e) => updateFieldProperty(field.id, 'validationPattern', e.target.value)}
              style={{ width: '100%', padding: '5px' }}
            >
              <option value="">No validation</option>
              <option value="email">Email</option>
              <option value="phone">Phone Number</option>
              <option value="url">URL</option>
              <option value="number">Numbers Only</option>
              <option value="custom">Custom Pattern</option>
            </select>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Show Only If:</label>
            <select 
              value={field.conditionalField || ''}
              onChange={(e) => updateFieldProperty(field.id, 'conditionalField', e.target.value)}
              style={{ width: '100%', padding: '5px' }}
            >
              <option value="">Always show</option>
              {/* Show other fields as options for conditional logic */}
              {selectedFields.filter(f => f.id !== field.id).map(f => (
                <option key={f.id} value={f.id}>{f.friendlyName}</option>
              ))}
            </select>
          </div>
          {field.validationPattern === 'custom' && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Custom Regex:</label>
              <input 
                type="text" 
                value={field.customPattern || ''}
                onChange={(e) => updateFieldProperty(field.id, 'customPattern', e.target.value)}
                placeholder="^[A-Z]{2,3}-\d+$"
                style={{ width: '100%', padding: '5px' }}
              />
            </div>
          )}
        </div>
        
        {field.conditionalField && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Condition:</label>
              <select 
                value={field.conditionalOperator || 'equals'}
                onChange={(e) => updateFieldProperty(field.id, 'conditionalOperator', e.target.value)}
                style={{ width: '100%', padding: '5px' }}
              >
                <option value="equals">Equals</option>
                <option value="not_equals">Not Equals</option>
                <option value="contains">Contains</option>
                <option value="not_empty">Not Empty</option>
                <option value="empty">Empty</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Value:</label>
              <input 
                type="text" 
                value={field.conditionalValue || ''}
                onChange={(e) => updateFieldProperty(field.id, 'conditionalValue', e.target.value)}
                placeholder="Condition value..."
                style={{ width: '100%', padding: '5px' }}
                disabled={field.conditionalOperator === 'not_empty' || field.conditionalOperator === 'empty'}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FormBuilder = () => {
  const [selectedFields, setSelectedFields] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [jiraFields, setJiraFields] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [fieldSearch, setFieldSearch] = useState('');

  useEffect(() => {
    fetchJiraFields();
    fetchTemplates();
    fetchProjects();
  }, []);

  const fetchJiraFields = async () => {
    try {
      const response = await invokeResolver('getJiraFields');
      setJiraFields(response.fields || []);
    } catch (error) {
      console.error('Failed to fetch Jira fields:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await invokeResolver('getTemplates');
      setSavedTemplates(response.templates || []);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
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

  const addField = (jiraField) => {
    // Check for duplicates
    if (selectedFields.some(f => f.jiraId === jiraField.id)) {
      alert('Field already added!');
      return;
    }
    setSelectedFields([...selectedFields, { 
      id: `field_${Date.now()}`, // Use string ID for drag and drop
      jiraId: jiraField.id,
      name: jiraField.name,
      friendlyName: jiraField.name, // Default to original name
      helpText: '',
      type: jiraField.schema?.type || 'string',
      required: false,
      conditionalField: '',
      conditionalOperator: 'equals',
      conditionalValue: '',
      validationPattern: '',
      customPattern: ''
    }]);
  };

  const updateFieldProperty = (fieldId, property, value) => {
    setSelectedFields(selectedFields.map(field => 
      field.id === fieldId ? { ...field, [property]: value } : field
    ));
  };

  const removeField = (fieldId) => {
    setSelectedFields(selectedFields.filter(f => f.id !== fieldId));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id && over) {
      setSelectedFields((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const saveTemplate = async () => {
    if (!templateName || selectedFields.length === 0 || !selectedProject) {
      alert('Please enter template name, select project, and add at least one field');
      return;
    }
    
    try {
      const response = await invokeResolver('saveTemplate', {
        name: templateName,
        projectId: selectedProject,
        fields: selectedFields
      });
      
      if (response.success) {
        alert('Template saved successfully!');
        setTemplateName('');
        setSelectedProject('');
        setSelectedFields([]);
        fetchTemplates(); // Refresh template list
      } else {
        alert(response.error || 'Failed to save template');
      }
    } catch (error) {
      alert('Failed to save template');
    }
  };

  const loadTemplate = (template) => {
    setTemplateName(template.name);
    setSelectedFields(template.fields);
  };

  const availableFields = jiraFields
    .filter(field => 
      !selectedFields.some(selected => selected.jiraId === field.id) &&
      (fieldSearch === '' || field.name.toLowerCase().includes(fieldSearch.toLowerCase()))
    )
    .sort((a, b) => {
      // Priority order: Summary first, Description second, then alphabetical
      if (a.name === 'Summary') return -1;
      if (b.name === 'Summary') return 1;
      if (a.name === 'Description') return -1;
      if (b.name === 'Description') return 1;
      return a.name.localeCompare(b.name);
    });

  if (loading) return <div style={{ padding: '20px' }}>Loading Jira fields...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Form Builder</h1>
      
      <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Template Name"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          style={{ padding: '8px' }}
        />
        <select 
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          style={{ padding: '8px' }}
        >
          <option value="">Select Project...</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
        {savedTemplates.length > 0 && (
          <select 
            onChange={(e) => e.target.value && loadTemplate(savedTemplates[e.target.value])}
            style={{ padding: '8px' }}
          >
            <option value="">Load Template...</option>
            {savedTemplates.map((template, index) => (
              <option key={index} value={index}>{template.name} ({template.projectName || 'No Project'})</option>
            ))}
          </select>
        )}
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h3>Available Jira Fields ({availableFields.length}):</h3>
          <input 
            type="text" 
            placeholder="Search fields..."
            value={fieldSearch}
            onChange={(e) => setFieldSearch(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
            {availableFields.map(field => (
              <div key={field.id} style={{ 
                padding: '8px', 
                border: '1px solid #eee', 
                margin: '5px 0',
                cursor: 'pointer',
                backgroundColor: '#f9f9f9'
              }} onClick={() => addField(field)}>
                <strong>{field.name}</strong>
                <br />
                <small>{field.schema?.type || 'unknown'}</small>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h3>Selected Fields:</h3>
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div style={{ 
              minHeight: '400px', 
              border: '2px dashed #ccc', 
              padding: '10px',
              borderRadius: '4px',
              backgroundColor: '#fafafa'
            }}>
              <SortableContext 
                items={selectedFields.map(f => f.id)}
                strategy={verticalListSortingStrategy}
              >
                {selectedFields.map(field => (
                  <SortableField 
                    key={field.id}
                    field={field}
                    updateFieldProperty={updateFieldProperty}
                    removeField={removeField}
                    selectedFields={selectedFields}
                  />
                ))}
              </SortableContext>
              {selectedFields.length === 0 && (
                <div style={{ 
                  textAlign: 'center', 
                  color: '#666', 
                  padding: '50px',
                  fontStyle: 'italic'
                }}>
                  📝 Drag fields here or click fields from the left to add them
                </div>
              )}
            </div>
          </DndContext>
        </div>
      </div>

      <button 
        onClick={saveTemplate}
        style={{ 
          marginTop: '20px', 
          padding: '10px 20px', 
          backgroundColor: '#007acc', 
          color: 'white', 
          border: 'none',
          cursor: 'pointer',
          opacity: (!templateName || selectedFields.length === 0) ? 0.5 : 1
        }}
        disabled={!templateName || selectedFields.length === 0 || !selectedProject}
      >
        Save Template
      </button>
    </div>
  );
};

export default FormBuilder;