# Forge Form Builder App

A powerful Atlassian Forge app that enables dynamic form creation and Jira issue generation with advanced features like conditional logic, field validation, and drag-and-drop form building.

## 🚀 Features

### ✅ Completed Features
- **Dynamic Form Builder** - Drag-and-drop interface for creating custom forms
- **Jira Integration** - Real-time field discovery and issue creation
- **Project-Specific Forms** - Templates filtered by Jira project
- **Conditional Logic** - Show/hide fields based on user input
- **Field Validation** - Email, phone, URL, number, and custom regex patterns
- **Required Fields** - Mark fields as required with visual indicators
- **Template Management** - Save, load, and manage form templates
- **Modern UI** - Clean, intuitive interface with drag-and-drop reordering

### 🎯 Key Capabilities
- **90+ Jira Fields** - Access to all standard and custom Jira fields
- **Atlassian Document Format** - Proper formatting for Jira descriptions
- **Real Issue Creation** - Creates actual Jira issues with proper metadata
- **Template Persistence** - Forms saved using Forge Storage API
- **Project Context** - Automatically detects current project context

## 📋 Project Status

### Phase 1: Project Setup ✅ COMPLETE
- [x] Forge app with Custom UI
- [x] Project structure with frontend/resolvers
- [x] Manifest configuration
- [x] Dependencies and deployment

### Phase 2: Core Form Builder ✅ COMPLETE
- [x] FormBuilder React component
- [x] Field selection UI
- [x] Drag-and-drop field arrangement
- [x] Template save/load functionality
- [x] Form validation

### Phase 3: Jira Integration & Polish ✅ COMPLETE
- [x] Custom gradient icon with magic wand
- [x] Jira field discovery resolver
- [x] Forge Storage integration
- [x] Project selection functionality
- [x] Issue creation with proper formatting

### Phase 4: Enhanced Form Builder Features ✅ IN PROGRESS
- [x] Conditional Logic (Dynamic Fields)
- [x] Field Validation (Email, phone, URL, number, custom regex)
- [x] Required Field Support
- [x] Drag-and-Drop Field Reordering
- [ ] Rich Text Editor for descriptions
- [ ] File Upload Support
- [ ] Multi-select and checkbox groups
- [ ] Date/Time pickers with validation

## 🛠️ Tech Stack

- **Frontend**: React 18, Custom UI (no UI Kit)
- **Backend**: Forge Resolvers, Forge Storage API
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable
- **Build**: Webpack, Babel
- **Deployment**: Atlassian Forge Platform

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Atlassian Forge CLI
- Jira Cloud instance

### Installation
1. Clone the repository
```bash
git clone https://github.com/GeorgeRCAdamJohnson/Form_Build_Forge_App.git
cd Form_Build_Forge_App
```

2. Install dependencies
```bash
cd formbuilder
npm install
```

3. Build the app
```bash
npm run build
```

4. Deploy to Forge
```bash
forge deploy
forge install
```

### Development
For development with live reload:
```bash
forge tunnel
npm run dev
```

## 📖 Usage

### Admin Interface
1. Navigate to **Apps > Form Builder** in Jira
2. Use the **Form Builder** tab to create templates
3. Select Jira fields and configure properties
4. Drag fields to reorder them
5. Set up conditional logic and validation
6. Save templates for specific projects

### User Interface
1. Go to **Project Settings > Custom Forms**
2. Select a form template
3. Fill out the dynamic form
4. Submit to create Jira issues automatically

## 🎨 Advanced Features

### Conditional Logic
- Show/hide fields based on other field values
- Support for equals, not equals, contains, empty/not empty conditions
- Real-time form updates as users interact

### Field Validation
- Built-in patterns: Email, Phone, URL, Numbers
- Custom regex patterns for specific requirements
- Real-time validation feedback

### Drag & Drop
- Intuitive field reordering
- Visual feedback during drag operations
- Modern UX with smooth animations

## 🔧 Architecture

```
formbuilder/
├── src/
│   ├── frontend/          # React components
│   │   ├── FormBuilder.jsx    # Main form builder
│   │   ├── ProjectForms.jsx   # User-facing forms
│   │   └── AdminApp.jsx       # Admin interface
│   ├── resolvers/         # Forge backend resolvers
│   └── index.js          # Entry point
├── static/               # Built assets
└── manifest.yml         # Forge configuration
```

## 🚧 Future Enhancements

- **External User Access** - Portal mode for non-Jira users
- **Form Analytics** - Submission tracking and reporting
- **Automation Hooks** - Trigger actions based on form submissions
- **Workflow Integration** - Deep Jira workflow integration
- **Bulk Operations** - Mass issue creation and template management

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support and questions, please open an issue in this repository.