import { invoke } from '@forge/bridge';

// Custom UI API bridge for resolver calls
export const invokeResolver = async (key, payload = {}) => {
  console.log(`Calling resolver: ${key}`, payload);
  
  try {
    // Use proper Forge bridge
    console.log('Using @forge/bridge invoke');
    const response = await invoke(key, payload);
    console.log(`Resolver ${key} success:`, response);
    return response;
  } catch (error) {
    console.error(`Resolver ${key} failed:`, error);
    console.log('Falling back to mock data');
    return mockResolverResponse(key, payload);
  }
};

const mockResolverResponse = (key, payload) => {
  switch (key) {
    case 'getJiraFields':
      return {
        fields: [
          { id: 'summary', name: 'Summary', schema: { type: 'string' } },
          { id: 'description', name: 'Description', schema: { type: 'string' } },
          { id: 'priority', name: 'Priority', schema: { type: 'priority' } },
          { id: 'assignee', name: 'Assignee', schema: { type: 'user' } },
          { id: 'reporter', name: 'Reporter', schema: { type: 'user' } },
          { id: 'labels', name: 'Labels', schema: { type: 'array' } }
        ]
      };
    case 'getTemplates':
      return { templates: JSON.parse(localStorage.getItem('mockTemplates') || '[]') };
    case 'getProjects':
      return {
        projects: [
          { id: '10001', key: 'DEMO', name: 'Demo Project' },
          { id: '10002', key: 'TEST', name: 'Test Project' },
          { id: '10003', key: 'PROD', name: 'Production Project' }
        ]
      };
    case 'saveTemplate':
      const templates = JSON.parse(localStorage.getItem('mockTemplates') || '[]');
      const newTemplate = { id: Date.now(), ...payload };
      templates.push(newTemplate);
      localStorage.setItem('mockTemplates', JSON.stringify(templates));
      return { success: true, template: newTemplate };
    default:
      return { success: false, error: 'Unknown resolver' };
  }
};