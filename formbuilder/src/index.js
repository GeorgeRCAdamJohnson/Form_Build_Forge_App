import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';
import { storage } from '@forge/api';

const resolver = new Resolver();

resolver.define('getJiraFields', async () => {
  console.log('getJiraFields resolver called');
  try {
    const response = await api.asApp().requestJira(route`/rest/api/3/field`);
    console.log('Jira API response status:', response.status);
    const fields = await response.json();
    console.log('Total fields from Jira:', fields.length);
    console.log('Sample fields:', fields.slice(0, 3));
    
    // Include both system and custom fields
    const filteredFields = fields.filter(f => f.schema && f.name);
    console.log('Filtered fields count:', filteredFields.length);
    
    return { fields: filteredFields };
  } catch (error) {
    console.error('Error fetching Jira fields:', error);
    // Return mock data as fallback
    return {
      fields: [
        { id: 'summary', name: 'Summary', schema: { type: 'string' } },
        { id: 'description', name: 'Description', schema: { type: 'string' } },
        { id: 'priority', name: 'Priority', schema: { type: 'priority' } },
        { id: 'assignee', name: 'Assignee', schema: { type: 'user' } }
      ]
    };
  }
});

resolver.define('getTemplates', async () => {
  const templates = await storage.get('templates') || [];
  return { templates };
});

resolver.define('saveTemplate', async ({ payload }) => {
  const { name, fields } = payload;
  const templates = await storage.get('templates') || [];
  
  // Check for duplicate names
  if (templates.some(t => t.name === name)) {
    return { success: false, error: 'Template name already exists' };
  }
  
  const newTemplate = { id: Date.now(), name, projectId: payload.projectId, fields, created: new Date().toISOString() };
  templates.push(newTemplate);
  
  await storage.set('templates', templates);
  return { success: true, template: newTemplate };
});

resolver.define('getProjects', async () => {
  try {
    const response = await api.asApp().requestJira(route`/rest/api/3/project`);
    const projects = await response.json();
    return { projects: projects.map(p => ({ id: p.id, key: p.key, name: p.name })) };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { projects: [{ id: '1', key: 'DEMO', name: 'Demo Project' }] };
  }
});

resolver.define('getCurrentProject', async ({ context }) => {
  console.log('getCurrentProject context:', context);
  
  // Extract project info from context
  const projectId = context.extension?.project?.id || context.cloudId;
  const projectKey = context.extension?.project?.key;
  
  if (projectId) {
    try {
      // Get project details from Jira API
      const response = await api.asApp().requestJira(route`/rest/api/3/project/${projectKey || projectId}`);
      const project = await response.json();
      console.log('Project from API:', project);
      return { project: { id: project.id, key: project.key, name: project.name } };
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  }
  
  // Fallback
  return { project: { id: 'unknown', name: 'Current Project' } };
});

resolver.define('createIssue', async ({ payload }) => {
  const { projectId, templateId, fieldData } = payload;
  
  try {
    console.log('Creating issue with data:', { projectId, fieldData });
    
    // Create issue using Jira API
    const issueData = {
      fields: {
        project: { id: projectId },
        issuetype: { id: '10001' }, // Default issue type - Bug
        summary: fieldData.summary || 'New Issue',
        description: fieldData.description ? {
          type: 'doc',
          version: 1,
          content: [{
            type: 'paragraph',
            content: [{
              type: 'text',
              text: fieldData.description
            }]
          }]
        } : undefined,
        ...Object.fromEntries(
          Object.entries(fieldData).filter(([key]) => key !== 'summary' && key !== 'description')
        )
      }
    };
    
    console.log('Issue payload:', JSON.stringify(issueData, null, 2));
    
    const response = await api.asUser().requestJira(route`/rest/api/3/issue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(issueData)
    });
    
    console.log('Jira response status:', response.status);
    const result = await response.json();
    console.log('Jira response body:', result);
    
    if (response.status === 201 && result.key) {
      return { success: true, issueKey: result.key };
    } else {
      return { success: false, error: result.errors || 'Failed to create issue' };
    }
  } catch (error) {
    console.error('Error creating issue:', error);
    return { success: false, error: error.message };
  }
});

resolver.define('deleteTemplate', async ({ payload }) => {
  const { id } = payload;
  const templates = await storage.get('templates') || [];
  const filtered = templates.filter(t => t.id !== id);
  
  await storage.set('templates', filtered);
  return { success: true };
});

export const handler = resolver.getDefinitions();